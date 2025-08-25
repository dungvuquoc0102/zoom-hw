(async () => {
  const res = await fetch("https://spotify.f8team.dev/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "dungvq0102@gmail.com",
      password: "Aa123456@",
    }),
  });
  console.log(await res.json());
})();
