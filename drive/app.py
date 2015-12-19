from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

# gauth = GoogleAuth()
# gauth.LocalWebserverAuth()

# drive = GoogleDrive(gauth)
drive = GoogleDrive()

spanish_script_id = '1IKLKK5c9BIDx0J7E4Dc9KrwulFzP-3Sq3JXKFQbEJ-M'
file_list = drive.ListFile({'q': "'root' in parents and trashed=false"}).GetList()
for file1 in file_list:
  print 'title: %s, id: %s' % (file1['title'], file1['id'])
