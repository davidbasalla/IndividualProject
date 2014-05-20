"""script to upload directory contents to davidbasalla3d.com"""

from ftplib import FTP
import os
import time
import glob


"""
website = 'www.davidbasalla3d.com'
username = 'web250'
password = '6lvrxwnf'
folder = 'html'
filename = 'latestBackup.sql'
fileloc = 'C:/PhysioDatenbank/backup/physioBackup_07_09_2012_15_42_34.sql'
"""

#get all relevant files in the current directory



def getFiles(fileTypes = ['html','js','css']):

    workDir = os.getcwd()
    fileList = []

    for fileType in fileTypes:
        fileList += glob.glob(workDir + '/*.' + fileType)

    return fileList




class FtpConnect():

    def __init__(self,fileList = None, targetFolder = None):

        self.connectStatus = True

        if fileList:
            self.fileList = fileList
        else:
            self.fileList = None
        print self.fileList

        self.website = 'www.davidbasalla3d.com'
        self.username = 'web250'
        self.password = '6lvrxwnf'

        #login to website
        try:
            self.ftp = FTP(self.website)
            self.ftp.login(self.username, self.password)
            print 'Successfully connected to %s' % self.website

            if targetFolder:
                self.changeDir(targetFolder)

            print 'Currently in %s' % targetFolder

        except:
            print 'Warning - could not connect to %s' % self.website
            self.connectStatus = False


    def changeDir(self, path):
        self.ftp.cwd(path)


    def uploadFiles(self, mode = 0):

        if self.fileList:
            print 'starting upload'
            #self.ftp.cwd(self.folder)

            start = time.time()

            for filePath in self.fileList:

                print 'Uploading %s ...' % filePath.split('\\')[-1]
                if mode == 0:
                    print 'Running ftpUpload with storbinary'
                    self.ftp.storbinary('STOR ' + filePath.split('\\')[-1],open(filePath,'rb'))
                else:
                    print 'Running ftpUpload with storlines'
                    self.ftp.storlines('STOR ' + filePath.split('\\')[-1],open(filePath,'rb'))

            self.ftp.close()

            print 'Transfer took %.2f seconds' % (time.time() - start)

            return float(time.time() - start)

            print 'upload complete'
        else:
            print 'Warning - No filename found'
            return 0



""" RUN IT """

filesToCopy = getFiles()
print filesToCopy
test = FtpConnect(filesToCopy,'html/MscComputerScience/IndividualProject/code/')
test.uploadFiles()

