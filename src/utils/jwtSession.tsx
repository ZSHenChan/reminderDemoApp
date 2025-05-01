const setSessionItem = (jwtToken: string) => {
  sessionStorage.setItem("token", JSON.stringify({ token: jwtToken }));
};

const getSessionItem = () => {
  const jwtToken = sessionStorage.getItem("token");
  return jwtToken ? JSON.parse(jwtToken) : null;
};

export { setSessionItem, getSessionItem };
