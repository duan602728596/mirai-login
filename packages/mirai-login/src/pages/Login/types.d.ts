export interface FormValue {
  username: string;
  password: string;
  rememberPwd?: boolean;
}

export interface LoginInfo {
  qqNumber: string;
  time: string;
  value: {
    password: string;
  };
}