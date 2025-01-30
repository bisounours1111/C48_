import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def sendToken_resetpassword(email,token):
# Set up email message
    sender_email = 'frozzsmurf@gmail.com'
    receiver_email = email
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Reset your password'
    body = 'Here is the link to reset your password: http://localhost:5000/resetpassword?token='+ token
    message.attach(MIMEText(body, 'plain'))

    # Log in to SMTP server and send email
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'frozzsmurf@gmail.com'
    smtp_password = 'kckiyqursvgfuuyd'
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)


def sendToken_verifyaccount(email,token):
# Set up email message
    sender_email = 'frozzsmurf@gmail.com'
    receiver_email = email
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Activate your account'
    body = 'Here is the link to activate your account: http://localhost:5000/verify?token='+ token
    message.attach(MIMEText(body, 'plain'))

    # Log in to SMTP server and send email
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'frozzsmurf@gmail.com'
    smtp_password = 'kckiyqursvgfuuyd'
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)


def sendUpdatedPassword(email):
# Set up email message
    sender_email = 'frozzsmurf@gmail.com'
    receiver_email = email
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Your password has been updated'
    body = "Your password has been updated, contact support immediately if you aren't the author of this change,"
    message.attach(MIMEText(body, 'plain'))

    # Log in to SMTP server and send email
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'frozzsmurf@gmail.com'
    smtp_password = 'kckiyqursvgfuuyd'
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)




