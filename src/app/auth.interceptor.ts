import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Grab the VIP pass from localStorage
  const token = localStorage.getItem('token');

  // 2. If we have a token, staple it to the 'Authorization' header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Send the modified request to the API
    return next(clonedRequest);
  }

  // 3. If no token exists (like when they are trying to log in), just send the normal request
  return next(req);
};