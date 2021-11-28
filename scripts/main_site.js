const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const WIN_WIDTH = 480
const WIN_HEIGHT = 260
const MARGIN = 10
const VELOCITY = 15
const TICK_LENGTH = 15
/**
 * Array to store the child windows spawned by this window.
 */
 const wins = []

/**
 * Ask the user "are you sure you want to leave this page?". In most browsers,
 * this will not actually do anything unless the user has at least one interaction
 * with the page before they close it.
 */
 function confirmPageUnload () {
  window.addEventListener('beforeunload', event => {
    speak('Please don\'t go!')
    event.returnValue = true
  })
}
/**
 * Focus all child windows. Requires user-initiated event.
 */
 function focusWindows () {
  wins.forEach(win => {
    if (!win.closed) win.focus()
  })
}
/**
 * Get random x, y coordinates for a new window on the screen. Takes into account
 * screen size, window size, and leaves a safe margin on all sides.
 */
 function getRandomCoords () {
  const x = MARGIN +
    Math.floor(Math.random() * (SCREEN_WIDTH - WIN_WIDTH - MARGIN))
  const y = MARGIN +
    Math.floor(Math.random() * (SCREEN_HEIGHT - WIN_HEIGHT - MARGIN))
  return { x, y }
}

function requestClipboardRead () {
  try {
    navigator.clipboard.readText().then(
      data => {
        if (!window.ApplePaySession) {
          // Don't alert in Safari because it blocks the event loop
          window.alert("Successfully read data from clipboard: '" + data + "'")
        }
      },
      () => {}
    )
  } catch {}
}

function requestMidiAccess () {
  try {
    navigator.requestMIDIAccess({
      sysex: true
    })
  } catch {}
}

/**
 * Request access to Bluetooth devices.
 * Requires user-initiated event.
 */
 function requestBluetoothAccess () {
  try {
    navigator.bluetooth.requestDevice({
      // filters: [...] <- Prefer filters to save energy & show relevant devices.
      // acceptAllDevices here ensures dialog can populate, we don't care with what.
      acceptAllDevices: true
    })
      .then(device => device.gatt.connect())
  } catch {}
}


/**
 * Request access to USB devices.
 * Requires user-initiated event.
 */
 function requestUsbAccess () {
  try {
    navigator.usb.requestDevice({ filters: [{}] })
  } catch {}
}

/**
 * Request access to Serial devices.
 * Requires user-initiated event.
 */
function requestSerialAccess () {
  try {
    navigator.serial.requestPort({ filters: [] })
  } catch {}
}

/**
 * Request access to HID devices.
 * Requires user-initiated event.
 */
function requestHidAccess () {
  try {
    navigator.hid.requestDevice({ filters: [] })
  } catch {}
}

/**
 * Move the window around the screen and bounce off of the screen edges.
 */
 function moveWindowBounce () {
  let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
  let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)

  setInterval(() => {
    const x = window.screenX
    const y = window.screenY
    const width = window.outerWidth
    const height = window.outerHeight

    if (x < MARGIN) vx = Math.abs(vx)
    if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
    if (y < MARGIN + 20) vy = Math.abs(vy)
    if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)

    window.moveBy(vx, vy)
  }, TICK_LENGTH)
}

function requestWebauthnAttestation () {
  try {
    // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
    // This code is public domain, per https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses

    // sample arguments for registration
    const createCredentialDefaultArgs = {
      publicKey: {
      // Relying Party (a.k.a. - Service):
        rp: {
          name: 'Acme'
        },

        // User:
        user: {
          id: new Uint8Array(16),
          name: 'john.p.smith@example.com',
          displayName: 'John P. Smith'
        },

        pubKeyCredParams: [{
          type: 'public-key',
          alg: -7
        }],

        attestation: 'direct',

        timeout: 60000,

        challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
          0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
          0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
        ]).buffer
      }
    }

    // sample arguments for login
    const getCredentialDefaultArgs = {
      publicKey: {
        timeout: 60000,
        // allowCredentials: [newCredential] // see below
        challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
          0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
          0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
        ]).buffer
      }
    }

    // register / create a new credential
    navigator.credentials.create(createCredentialDefaultArgs)
      .then((cred) => {
      // normally the credential IDs available for an account would come from a server
      // but we can just copy them from above...
        const idList = [{
          id: cred.rawId,
          transports: ['usb', 'nfc', 'ble'],
          type: 'public-key'
        }]
        getCredentialDefaultArgs.publicKey.allowCredentials = idList
        return navigator.credentials.get(getCredentialDefaultArgs)
      })
  } catch {}
}



/**
 * Open a new popup window. Requires user-initiated event.
 */
 function openWindow () {
    const { x, y } = getRandomCoords()
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`
    const win = window.open(window.location.pathname, '', opts)
  
  }
/**
 * Move the window around the screen and bounce off of the screen edges.
 */
function moveWindowBounce () {
  let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
  let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)

  setInterval(() => {
    const x = window.screenX
    const y = window.screenY
    const width = window.outerWidth
    const height = window.outerHeight

    if (x < MARGIN) vx = Math.abs(vx)
    if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
    if (y < MARGIN + 20) vy = Math.abs(vy)
    if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)

    window.moveBy(vx, vy)
  }, TICK_LENGTH)
}
moveWindowBounce()