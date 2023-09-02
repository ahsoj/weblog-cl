import {
  LoginCredential,
  RegisterCredential,
  UserInfo,
} from '@/types/interface';
import axios from './axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

class Auth {
  getUser() {
    let accessToken = Cookies.get('token');
    if (!accessToken) return null;
    return jwt_decode(accessToken) as UserInfo;
  }
  login({ email, password, remember }: LoginCredential): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/login/', { email, password })
        .then((resp) => {
          resolve(resp.data);
          if (resp.data.accessToken) {
            Cookies.set('token', JSON.stringify(resp.data.accessToken), {
              expires: remember ? 60 : 2,
            });
          }
          if (typeof window !== undefined) {
            window.location.href = '/';
          }
        })
        .catch((err) => reject(err));
    });
  }
  register({ name, email, password }: RegisterCredential): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .post(`/auth/register/`, {
          name,
          email,
          password,
        })
        .then((resp) => {
          if (resp.status === 201) {
            resolve(resp.data);
          }
          if (typeof window !== undefined) {
            window.location.href = '/create_account/verify_email';
          }
        })
        .catch((err) => reject(err));
    });
  }
  resetPassword(email: string): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .post(`/auth/reset_password/`, { email })
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => reject(err));
    });
  }
  logout() {
    try {
      Cookies.remove('token');
      delete axios.defaults.headers.Authorization;
      if (typeof window !== undefined) {
        window.location.href = '/signin';
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Auth();
