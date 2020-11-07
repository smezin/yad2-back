const sgMail = require('@sendgrid/mail')
const { logger } = '../logger/winstonLogger'
const sgAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sgAPIKey)
const appEmail = 'smezin@gmail.com'

const sendEmailToUser = async (email, name, type) => {
  const welcomeSubject = `Hi ${name}, Welcome to YAD2 community`
  const welcomeText = `We are so happy you decided to signup, you actually made our day better ${name}`
  const cancellationSubject = `Sorry to see you go ${name}`
  const cancellationText = `Best of luck ${name}, we hope to see you again`
  let messageSubject = ''
  let messageText = ''
  if (type === 'welcome') {
    messageSubject = welcomeSubject
    messageText = welcomeText
  } else if (type === 'cancellation') {
    messageSubject = cancellationSubject,
    messageText = cancellationText
  } else {
    return
  }
  const welcomeMessage = {
    to: email,
    from: appEmail,
    subject: messageSubject,
    text: messageText
  }
  try {
    await sgMail.send(welcomeMessage);
  } catch (error) {
    logger.error(`send mail error :${error}`) 
    if (error.response) {
      logger.error(`send mail error ${error.response.body}`)
    }
  }
}

module.exports = {
  sendEmailToUser
}