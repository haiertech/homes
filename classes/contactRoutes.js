const MessageModel = require( '../models/message' )
const Mailer = require( './mailer' )
const keys = require( '../config/keys' )

class ContactRoutes {

  constructor( server, app ) {

    this.server = server
    this.app = app
    this.MessageModel = MessageModel

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get( '/contact', this.renderPage.bind( this ) )

    // Message API
    this.server.post( '/api/contact', this.createMessage.bind( this ) )
  }


  renderPage( req, res ) {

    const actualPage = '/contact'

    this.app.render( req, res, actualPage )
  }


  createMessage( req, res ) {

    const { contactName, contactEmail, contactMessage } = req.body
    const messageObj = {
      name: contactName,
      email: contactEmail,
      message: contactMessage,
    }
    const message = new this.MessageModel( messageObj )

    const mailer = new Mailer();
    const templatePath = 'emails/contact.html'
    const subject = `New message from ${message.name}!`

    const sent = mailer.sendEmail( message, templatePath, keys.adminEmail, subject )

    if (sent) {
      message.emailSent = true
    }

    message.save()
    res.send( message )
  }
}


module.exports = ContactRoutes
