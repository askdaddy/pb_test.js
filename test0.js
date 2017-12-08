/**
 * Created by seven on 08/12/2017.
 */


const test = require('./test_require')
    , util = require('util')

console.log(util.inspect(test))

test.a['foo']()
test['b']['foo']()
test.a.bar()