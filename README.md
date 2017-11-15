# Socket with Google protobuf


### Init

Update submodule
```
$ git submodule update --init
```

Install requirements
```
$ npm install
```


### Config
Copy the config.json.dist to `config.json` and modify the options in the file

### Run the test
Send a packet to remote server pack with protobuf
```
$ node sendtoserve.js
```


Write and read protobuf via text file
```
$ node viafile.js
```