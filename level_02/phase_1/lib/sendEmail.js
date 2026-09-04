 const sendEmail = async (email) => {
  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 5000);
  });
  console.log("Email sent successfully");
};
export default sendEmail;