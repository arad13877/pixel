"""Offline tests; synthetic FTP server, no credentials or customer records."""
import ftplib
import io
import json
from pathlib import Path
import runpy
import unittest
from unittest.mock import patch

module = runpy.run_path(str(Path(__file__).with_name('deploy-public-ftps.py')))
deploy = module['main']
scope = deploy.__globals__

class FakeFTP:
    def __init__(self, **kwargs):
        self.files = {'index.html': b'previous-public-home', 'articles/retired/index.html': b'previous-article', 'pixel-deployment.json': json.dumps({'html': ['articles/retired/index.html']}).encode()}
        self.closed = False
        self.encrypted = False
    def connect(self, host, port): self.host, self.port = host, port
    def login(self, user, password): pass
    def prot_p(self): self.encrypted = True
    def pwd(self): return '/'
    def voidcmd(self, cmd): pass
    def size(self, name):
        if name not in self.files: raise ftplib.error_perm('550 missing')
        return len(self.files[name])
    def mkd(self, path): pass
    def retrbinary(self, cmd, writer): writer(self.files[cmd.removeprefix('RETR ')])
    def storbinary(self, cmd, data): self.files[cmd.removeprefix('STOR ')] = data.read()
    def rename(self, source, dest): self.files[dest] = self.files.pop(source)
    def close(self): self.closed = True

class DeploymentTests(unittest.TestCase):
    def test_paths(self):
        for value in ('../crm/x', '/x', '.htaccess', '.well-known/x', 'php.ini', 'crm.pxlgrid.design/index.html', 'x\\y', 'x\ny'):
            with self.assertRaises(ValueError): module['safe_path'](value)
        self.assertEqual(module['safe_path']('articles/test/index.html'), 'articles/test/index.html')

    def test_backup_and_public_only_upload(self):
        server = FakeFTP()
        def live_read(url, **kwargs):
            return io.BytesIO(server.files['pixel-deployment.json' if '/pixel-deployment.json' in url else 'index.html'])
        env = {'FTPS_HOST': 'lin104.limoodns.com', 'FTPS_USERNAME': 'pixel-deploy@pxlgrid.design', 'FTPS_PASSWORD': 'synthetic-test-only', 'GITHUB_RUN_ID': '123', 'GITHUB_RUN_ATTEMPT': '1', 'GITHUB_SHA': 'test'}
        with patch.dict(scope['os'].environ, env), patch.object(scope['ftplib'], 'FTP_TLS', return_value=server), patch.object(scope['urllib'].request, 'urlopen', side_effect=live_read):
            deploy()
        self.assertTrue(server.encrypted)
        self.assertTrue(server.closed)
        self.assertEqual(server.files['.pixel-deploy-backups/123-1/index.html'], b'previous-public-home')
        self.assertEqual(server.files['.pixel-deploy-backups/123-1/articles/retired/index.html'], b'previous-article')
        self.assertIn(b'noindex,nofollow', server.files['articles/retired/index.html'])
        self.assertEqual(server.files['.pixel-deploy-backups/.htaccess'], b'Require all denied\n')
        self.assertFalse(any(path.startswith('crm/') or path in ('.htaccess', 'php.ini') for path in server.files))

    def test_wrong_root_refused_before_write(self):
        server = FakeFTP()
        server.pwd = lambda: '/home/pxlgridd'
        env = {'FTPS_HOST': 'lin104.limoodns.com', 'FTPS_USERNAME': 'pixel-deploy@pxlgrid.design', 'FTPS_PASSWORD': 'synthetic-test-only', 'GITHUB_RUN_ID': '123', 'GITHUB_RUN_ATTEMPT': '1', 'GITHUB_SHA': 'test'}
        before = dict(server.files)
        with patch.dict(scope['os'].environ, env), patch.object(scope['ftplib'], 'FTP_TLS', return_value=server), self.assertRaisesRegex(RuntimeError, 'Unexpected FTP root'):
            deploy()
        self.assertEqual(server.files, before)

if __name__ == '__main__': unittest.main()
