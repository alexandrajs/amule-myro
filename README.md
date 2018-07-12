# MySQL read-only layer for AlexandraJS aMule

[![Build Status](https://travis-ci.org/alexandrajs/amule-myro.svg?branch=master)](https://travis-ci.org/alexandrajs/amule-myro)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/amule-myro/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/amule-myro?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/amule-myro/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/amule-myro)

## Installation
```bash
$ npm i amule-myro --save
```

## Usage
```javascript
const AMule = require('amule');
const Aim = require('amule-aim');
const Rush = require('amule-rush');
const Myro = require('amule-myro');
const mule = new AMule();

// Add some compatible caches
mule.use(new Aim());
mule.use(new Rush());
mule.use(new Myro());

// Use it as single cache
```

## API docs
[MySQL read-only layer API](http://alexandrajs.github.io/amule-myro/)
