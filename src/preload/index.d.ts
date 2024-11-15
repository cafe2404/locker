import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ///user data
      registerUser: ({
        username,
        avatar,
        password
      }: {
        username: string
        avatar: string
        password: string
      }) => Promise<IUser>
      getAllUsers: () => Promise<IUser[]>
      authenticateUser: ({
        username,
        password
      }: {
        username: string
        password: string
      }) => Promise<{
        success: boolean,
        user: IUser
      }>
      updateAvatar: ({
        avatar
      }: {
        avatar: string
      }) => Promise<boolean>
      updatePassword: ({password,newPassword}: { password:string,newPassword: string}) => Promise<boolean>
      deleteUser: (username:string) => Promise<boolean>
      getUserSettings: () => Promise<IUserSetting>
      updateUserSettings: (data: IUserSetting) => Promise<boolean>
      //password data
      getPasswordData: () => Promise<IPasswordData[]>
      createPasswordData: (data:IPasswordData) => Promise<IPasswordData>
      getPasswordDataById: (id: number) => Promise<IPasswordData>
      updatePasswordData: (data:IPasswordData) => Promise<boolean>
      deletePasswordData: (id: number) => Promise<boolean>
      exportPasswordData: ({filePath}:{filePath:string}) => Promise<boolean>
      importPasswordData: ({filePath}:{filePath:string}) => Promise<IPasswordData[]>
      //category
      getCategories: () => Promise<ICategory[]>
      createCategory: ({name,icon}:{name:string,icon:string}) => Promise<ICategory>
      updateCategory: (data: ICategory) => Promise<boolean>
      deleteCategory: (id?: number) => Promise<boolean>
      clipboard: {
        writeText: (text: string) => void
      }
      shell: {
        openExternal: (url: string) => void
      }
      readCsvFile: (filePath: string) => Promise<IPasswordData[]>
      openCsvFile: () => Promise<string | undefined>
      saveCsvFile: () => Promise<string | undefined>
      openExternalApp: (filePath: string) => Promise<void>
      openURL: (url: string) => Promise<void>
      toggleStartUp: (enable: boolean) => Promise<void>
    },
  }
}
