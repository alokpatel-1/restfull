import { UserResponseDto } from './user.dto';

/** 404 / error response when user not found. */
export interface UserNotFoundResponse {
  success: false;
  message: string;
}

/** 200 response with user data. */
export interface UserGetSuccessResponse {
  success: true;
  message: string;
  data: UserResponseDto;
}
