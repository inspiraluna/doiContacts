// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const browserify = require('@cypress/browserify-preprocessor')
const POP3Client = require("poplib");
const emailJSMine = require("emailjs-mime-codec")

function fetchConfirmLinkFromPop3Mail(hostname,port,username,password,bobdapp_url,resolve) {

  console.log("step 3 - getting email from bobs inbox",hostname);
  console.log("step 3 -c getting email from bobs inbox",port);
  console.log("step 3 - getting email from bobs inbox",username);
  console.log("step 3 - getting email from bobs inbox",password);

  //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
  let client = new POP3Client(port, hostname, {
      tlserrs: false,
      enabletls: false,
      debug: false
  });

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

  let linkdata = null;

  client.on("connect", function() {
      console.log("CONNECT success");
      client.login(username, password);
      client.on("login", function(status) {
          if (status) {
              console.log("LOGIN/PASS success");
              client.list();

              client.on("list", function(status, msgcount, msgnumber) {

                  if (status === false) {
                      const err = "LIST failed"+ msgnumber;
                      client.rset();
                      return err;
                  } else {
                       console.log("LIST success with " + msgcount + " element(s).",msgnumber);

                      if (msgcount > 0){
                          client.retr(1);
                          client.on("retr", function(status, msgnumber, maildata) {

                              if (status === true) {
                                 console.log("status " + status);
                                 console.log("email content " + maildata);

                                  //https://github.com/emailjs/emailjs-mime-codec
                                  let html  = emailJSMine.quotedPrintableDecode(maildata);
                                      html = replaceAll(html,'http://172.20.0.8','http://localhost');  //TODO put this IP inside a config
                              
                                  linkdata =  html.substring(html.indexOf(bobdapp_url)).match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*[a-z,A-Z,0-9]{16,}/)[0];
                                  console.log('link ' + linkdata)

                                  client.dele(msgnumber);
                                  client.on("dele", function() {
                                      client.quit();
                                      client.end();
                                      client = null;
                                      resolve(linkdata)
                                  });

                              } else {
                                  const err = "RETR failed for msgnumber "+ msgnumber;
                                  client.rset();
                                  client.end();
                                  client = null;
                                  resolve(err)
                              }
                          });
                      }
                      else{
                          const err = "empty mailbox";
                          client.quit();
                          client.end();
                          client = null;
                          resolve(err)
                      }
                  }
              });

          } else {
              const err = "LOGIN/PASS failed";
              client.quit();
              client.end();
              client = null;
              resolve(err)
          }
      });
  });

  return linkdata
}

function delete_all_emails_from_pop3(hostname,port,username,password,bobdapp_url,resolve) {

    console.log("deleting all emails from bobs inbox");
    //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
    let client = new POP3Client(port, hostname, {
        tlserrs: false,
        enabletls: false,
        debug: false
    });

    client.on("connect", function() {
        console.log("CONNECT success");
        client.login(username, password);
        client.on("login", function(status) {
            if (status) {
                console.log("LOGIN/PASS success");
                client.list();

                client.on("list", function(status, msgcount, msgnumber) {

                    if (status === false) {
                        const err = "LIST failed"+ msgnumber;
                        client.rset();
                        return err;
                    } else {
                        if(bobdapp_url) console.log("LIST success with " + msgcount + " element(s)",'');

                        //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');
                        if (msgcount > 0){
                            for(let i = 0;i<=msgcount;i++){
                                client.dele(i+1);
                                client.on("dele", function(status) {
                                    console.log("deleted email"+(i+1)+" status:"+status);
                                   if(i==msgcount-1){
                                       client.quit();

                                       client.end();
                                       client = null;
                                       if(bobdapp_url) console.log("all emails deleted");
                                       resolve(null,'all emails deleted');
                                   }
                                });
                            }
                        }
                        else{
                            const err = "empty mailbox";
                            resolve(null, err); //we do not send an error here when inbox is empty
                            client.quit();
                            client.end();
                            client = null;
                            return;
                        }
                    }
                });

            } else {
                const err = "LOGIN/PASS failed";
                resolve(err, null);
                client.quit();
                client.end();
                client = null;
                return;
            }
        });
    });
}


module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const options = browserify.defaultOptions
  // print options to find babelify, it is inside transforms at index 1
  // and it is [filename, options]
  const babelOptions = options.browserifyOptions.transform[1][1]
  babelOptions.global = true
  // ignore all modules except files in lodash-es
  babelOptions.ignore = [/\/node_modules\/(?!doichain\/)/]
  // if you want to see the final options
  // console.log('%o', babelOptions)

  on('file:preprocessor', browserify(options))
  on('task', {
    hello ({ greeting, name }) {
      console.log('%s, %s', greeting, name)

      return null
    },
    confirmedLinkInPop3({ hostname,port,username,password,bobdapp_url}) {

      return new Promise((resolve) => {
        // tasks should not resolve with undefined
       // setTimeout(() => resolve(null), ms)
        fetchConfirmLinkFromPop3Mail(hostname,port,username,password,bobdapp_url,resolve);
  })
    },

    deleteAllEmailsFromPop3({hostname,port,username,password,bobdapp_url}) {

        return new Promise((resolve) => {
         delete_all_emails_from_pop3(hostname,port,username,password,bobdapp_url,resolve);
        })
    }
  });
}
