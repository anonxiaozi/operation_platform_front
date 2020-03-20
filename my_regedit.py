import winreg
import os

# putty -ssh remote_addr -t -l root -pw password
# winscp.exe sftp://user:password@remote_addr

def ChangeREG(ssh):
	local_location = os.popen('where {}'.format(app_name)).read().strip('\n')
	assert local_location, '没有找到{}'.format(app_name)
	winreg.CreateKey(winreg.HKEY_CLASSES_ROOT, r'{}\shell\open\command'.format(app_name))
	putty_key = winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, app_name, 0, winreg.KEY_ALL_ACCESS)
	winreg.SetValueEx(putty_key, 'URL Protocol', 0, winreg.REG_SZ, local_location)
	winreg.FlushKey(putty_key)
	putty_key.Close()
	command_key = winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, r'{}\shell\open\command'.format(app_name), 0, winreg.KEY_ALL_ACCESS)
	winreg.SetValueEx(command_key, '', 0, winreg.REG_SZ, local_location)
	winreg.FlushKey(command_key)
	command_key.Close()


if __name__ == "__main__":
	ssh = 'putty'
	try:
		ChangeREG(ssh)
	except Exception as e:
		print(e)
