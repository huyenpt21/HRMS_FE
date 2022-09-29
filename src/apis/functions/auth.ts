import { callAPI } from 'apis/axiosClient';
import { AuthDto } from 'apis/dto/auth';
import { AuthResponse } from 'apis/response/auth';
import { API_ROUTES } from 'constants/enums/api';

const auth = {
  login: (payload: AuthDto): Promise<AuthResponse> => {
    return callAPI('post', API_ROUTES.LOGIN, payload);
  },
};

export default auth;
