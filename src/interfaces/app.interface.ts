// ข้อมูลสมาชิก
export interface IAccount {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  id?: any;
  position?: string;
  image?: string;
  role?: RoleAccount;
  created?: Date;
  updated?: Date;
}

// ลงทะเบียน
export interface IRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  cpassword: string;
}

// เข้าสู่ระบบ
export interface ILogin {
  email: string;
  password: string;
  remember: boolean;
}

// แก้ไขข้อมูลโปรไฟล์
export interface IProfile {
  firstname: string;
  lastname: string;
  position: string;
  image: string;
}

// หน้าเปลี่ยนรหัสผ่าน
export interface IChangePassword {
  old_pass: string;
  new_pass: string;
  cnew_pass: string;
}

// CRUD หน้า ค้นหาข้อมูล
export interface ISearch {
  searchType?: string;
  searchText?: string;
  startPage: number;
  limitPage: number;
}

// CRUD หน้า Member
export interface IMember {
  items: IAccount[];
  totalItems: number;
}

// สิทธ์ผู้ใช้งาน
export enum RoleAccount {
  Member = 1,
  Employee,
  Admin,
}
