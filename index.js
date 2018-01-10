/*
    id.js -- Create tokens and ids
 */

import * as Cluster from 'cluster'
import * as Crypto from 'crypto'
import * as Uuid from 'uuid'

var epoch = 1455599858456           // 2-15-16
var seq = 0
var last = 0

export class Id {

    /* 
        Get a random token. Count is the number of random bytes 
     */
    static async token(count, encoding = 'base64') {
        return new Promise(function (resolve, reject) {
            Crypto.randomBytes(count, function(err, buf) {
                if (err) {
                    reject(err)
                } else {
                    resolve(buf.toString('base64'))
                }
            })
        })
    }

    /*
        Get a human readable ID. Output in hex. Size is the number of characters in the ID.
     */
    static async uid(size) {
        return new Promise(function (resolve, reject) {
            let count = parseInt(size / 6 * 2.5)
            Crypto.randomBytes(count, function(err, buf) {
                if (err) {
                    reject(err)
                } else {
                    resolve(buf.toString('hex').match(/(.....)/g).join('-'))
                }
            })
        })
    }

    static async uuid() {
        return uuid.v4()
    }

    /*
        Create an ID unique over a single data center
     */
    static did(datacenter) {
        let buf = new Buffer(8)
        let time = Date.getTime() - gen.epoch
        let worker = Cluster.isWorker ? Cluster.worker.id : 0
        let id = ((this.datacenter & 0xFF) << 24 | (worker & 0xFF)) << 16
        buf.fill(0)
        Id.seq = (time == Id.last) ? ((Id.seq + 1) & 0xFFFF) : 0
        Id.last = time
        buf.writeUInt32BE(1 << 30 | Id.id | Id.seq)
        buf.writeUInt32BE(time, 4)
        return buf.toString('hex')
    }
}
