let _id = undefined

const promises = []

let connection

function resolvePromises(value) {
  _id = value
  promises.forEach(resolve => resolve(_id))
  promises.length = 0
  connection.removeEventListener('icecandidate', onIceCandidate)
}

function onIceCandidate({ candidate }) {
  if (connection.iceGatheringState == 'complete' && _id == undefined) {
    return resolvePromises(null)
  }
  if (candidate && candidate.foundation) {
    return resolvePromises(candidate.foundation)
  }
}

async function startConnection() {
  if (connection) return

  connection = new RTCPeerConnection();

  connection.addEventListener('icecandidate', onIceCandidate);

  const offer = await connection.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  })
  connection.setLocalDescription(offer)
}

async function biri() {
  if (typeof RTCPeerConnection == 'undefined')
    throw new Error(`This browser doesn't support WebRTC, so biri cannot provide a unique, static ID for this machine.`)

  if (typeof _id != 'undefined') return _id

  const promise = new Promise(resolve => {
    startConnection()
    promises.push(resolve)
  })

  return promise
}

module.exports = biri
