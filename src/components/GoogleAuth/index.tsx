import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const GoogleAuth = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={response => {
          console.log('Google Response:', response); // Kiểm tra token nhận được
          //   fetch('http://localhost:5000/api/auth/google-login', {
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify({ id_token: response.credential }),
          //   })
          //     .then(res => res.json())
          //     .then(data => console.log('Login Success:', data))
          //     .catch(error => console.error(error));
        }}
        onError={() => console.log('Login Failed')}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
