interface IUser {
  id: number
  username: string
  avatar: string
  password: string
  created_at?: string
  settings?: IUserSettings
}

interface IPasswordData {
  id?: number
  name: string
  url: string
  icon: string
  username: string
  password: string
  user_id: number
  created_at?: Date,
  category_id:number
}

interface ICategory {
  id:number
  name:string
  icon:string
  created_at?:Date
  updated_at?:Date
  user_id?:number
}

interface IUserSettings {
  id : number
  user_id : number
  start_up_mode : boolean
  tray_icon : boolean
  auto_lock_time : number
  auto_lock_on_blur : boolean
  created_at : Date
  updated_at : Date
}