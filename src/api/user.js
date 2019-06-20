import axios from '@/libs/api.request'
import {userUrl} from '@/api/userUrl'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: userUrl.loginUrl,
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: userUrl.userInfoUrl,
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: userUrl.logoutUrl,
    params: {
      token
    },
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: userUrl.messageCountUrl,
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
