"""Public-only FTPS deployment. No deletes; save recoverable backups before replacement."""
import ftplib
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import ssl
import urllib.request

ROOT = Path('dist').resolve()
HOST = 'https://pxlgrid.design'
RESERVED = {'.htaccess', '.user.ini', 'php.ini', 'cgi-bin', '.well-known', 'crm', 'crm.pxlgrid.design'}

def safe_path(value):
    path = PurePosixPath(value)
    if path.is_absolute() or '..' in path.parts or not path.parts or '\\' in value or any(ord(c) < 32 for c in value):
        raise ValueError('Unsafe deployment path')
    if path.parts[0] in RESERVED or path.parts[0].startswith('.'):
        raise ValueError('Protected host path')
    return path.as_posix()

def ensure_directory(client, directory):
    for i in range(1, len(PurePosixPath(directory).parts) + 1):
        part = '/'.join(PurePosixPath(directory).parts[:i])
        try:
            client.mkd(part)
        except ftplib.error_perm:
            previous = client.pwd()
            client.cwd(part)  # Fail if not actually an existing accessible directory.
            client.cwd(previous)

def retrieve(client, name):
    buffer = io.BytesIO()
    client.retrbinary('RETR ' + name, buffer.write)
    return buffer.getvalue()

def existing(client, name):
    client.voidcmd('TYPE I')
    try:
        client.size(name)
        return True
    except ftplib.error_perm as error:
        if not str(error).startswith('550'): raise
        return False

def main():
    for name in ('FTPS_HOST', 'FTPS_USERNAME', 'FTPS_PASSWORD', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'GITHUB_SHA'):
        if not os.environ.get(name): raise RuntimeError('Missing deployment configuration: ' + name)
    if os.environ['FTPS_USERNAME'] != 'pixel-deploy@pxlgrid.design':
        raise RuntimeError('Only the public-root-restricted account is allowed')
    if os.environ['FTPS_HOST'] != 'lin104.limoodns.com':
        raise RuntimeError('Unexpected certificate hostname')
    files = {}
    for file in ROOT.rglob('*'):
        if file.is_symlink(): raise RuntimeError('Symlink in artifact')
        if file.is_file(): files[safe_path(file.relative_to(ROOT).as_posix())] = file.read_bytes()
    if 'index.html' not in files or 'articles/index.html' not in files: raise RuntimeError('Not a public site artifact')
    run = os.environ['GITHUB_RUN_ID'] + '-' + os.environ['GITHUB_RUN_ATTEMPT']
    if not run.replace('-', '').isdigit(): raise RuntimeError('Invalid run identity')
    client = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=45)
    try:
        client.connect(os.environ['FTPS_HOST'], 21)
        client.login(os.environ['FTPS_USERNAME'], os.environ['FTPS_PASSWORD'])
        client.prot_p()
        # cPanel jailed account must open at its own public-root jail.
        if client.pwd() not in ('/', '/home/pxlgridd/public_html'):
            raise RuntimeError('Unexpected FTP root; refusing deployment')
        if not existing(client, 'index.html'): raise RuntimeError('Public document root marker missing')
        backup = '.pixel-deploy-backups/' + run
        ensure_directory(client, '.pixel-deploy-backups')
        client.storbinary('STOR .pixel-deploy-backups/.htaccess', io.BytesIO(b'Require all denied\n'))
        ensure_directory(client, backup)
        previous = {}
        if existing(client, 'pixel-deployment.json'):
            previous = json.loads(retrieve(client, 'pixel-deployment.json'))
        # Archived routes must not keep serving an old published snapshot.
        for old in previous.get('html', []):
            old = safe_path(old)
            if not old.endswith('.html'): raise RuntimeError('Invalid prior manifest')
            if old not in files:
                files[old] = b'<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Not found</title><body><a href="/articles/">Back to articles</a></body></html>'
        manifest = {'run': run, 'commit': os.environ['GITHUB_SHA'], 'html': sorted(p for p in files if p.endswith('.html')), 'index_sha256': hashlib.sha256(files['index.html']).hexdigest()}
        files['pixel-deployment.json'] = json.dumps(manifest).encode()
        # Back up everything that will be overwritten, BEFORE any public replacement.
        for path in files:
            if existing(client, path):
                target = backup + '/' + path
                ensure_directory(client, str(PurePosixPath(target).parent))
                client.storbinary('STOR ' + target, io.BytesIO(retrieve(client, path)))
        # Assets first; entry pages and final commit marker last. No FTP mirror/delete.
        order = sorted(files, key=lambda p: (2 if p == 'pixel-deployment.json' else 1 if p.endswith('.html') else 0, p))
        for path in order:
            parent = str(PurePosixPath(path).parent)
            if parent != '.': ensure_directory(client, parent)
            temporary = path + '.pixel-upload-' + run
            client.storbinary('STOR ' + temporary, io.BytesIO(files[path]))
            client.rename(temporary, path)
        print('PASS: public files uploaded; previous versions backed up; CRM and host settings untouched.')
    finally:
        client.close()
    with urllib.request.urlopen(HOST + '/pixel-deployment.json?run=' + run, timeout=30) as response:
        live = json.load(response)
    if live.get('run') != run: raise RuntimeError('Live deployment marker mismatch')
    with urllib.request.urlopen(HOST + '/?run=' + run, timeout=30) as response:
        if hashlib.sha256(response.read()).hexdigest() != manifest['index_sha256']:
            raise RuntimeError('Live homepage differs from uploaded build')
    print('PASS: HTTPS live deployment verified.')

if __name__ == '__main__':
    main()
