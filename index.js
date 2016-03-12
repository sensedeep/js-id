/*
    node-idgen -- Create uuid and snowflake IDs
 */

export default class Idgen {
    constructor() {
        let datacenter = 1
        let worker = 1
        this.idgen = {
            epoch: 1455599858456,           // 2-15-16
            seq: 0,
            last: 0,
            id: ((datacenter & 0xFF) << 24 | (worker & 0xFF)) << 16
        }
    }

    static uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    static snowflake() {
        let idgen = this.idgen
        let buf = new Buffer(8)
        let time = Date.now() - idgen.epoch
        buf.fill(0)
        idgen.seq = (time == idgen.last) ? ((idgen.seq + 1) & 0xFFFF) : 0
        idgen.last = time
        /*
            32 (time - epoch) | 8 datacenter | 8 worker | 16 seqno
         */
        buf.writeUInt32BE(1 << 30 | idgen.id | idgen.seq)
        buf.writeUInt32BE(time, 4)
        return buf.toString('hex')
    }
}
