module.exports = {
    getRate: (req, res) => {
        if (!('weight' in req.query && 'type' in req.query)) {
            return respond(res, {
                status: 400,
                headers: {
                    'Content-Type': 'text/html',
                },
                message: 'Bad request: missing weight and/or type parameter(s)',
            });
        }

        let outputType = 'text/html';
        if ('output' in req.query) {
            switch (req.query.output) {
                case 'json':
                    outputType = 'application/json';
                    break;
                
                case 'html':
                case 'ajax':
                case '':
                case null:
                case undefined:
                    outputType = 'text/html';
                    break;

                // "output" must be valid or omitted
                default:
                    return respond(res, {
                        status: 400,
                        headers: {
                            'Content-Type': 'text/html',
                        },
                        message: `Invalid output type "${req.query.output}"`,
                    });
            }
        }

        let weight = Number(req.query.weight);
        let type = req.query.type;

        let price;
        let rate;
        let typeName;
        try {
            [rate, price, typeName] = calculateData(weight, type);
        } catch (err) {
            return respond(res, {
                status: 400,
                headers: {
                    'Content-Type': 'text/html',
                },
                message: err,
            });
        }

        res.set('Content-Type', outputType);
        switch (outputType) {
            case 'text/html':
                res.render('pages/cost.ejs', {
                    weight: weight.toFixed(2),
                    typeName: typeName,
                    rate: rate.toFixed(2),
                    price: price.toFixed(2),
                });
                break;
            
            case 'application/json':
                res.send(JSON.stringify({
                    weight: weight.toFixed(2),
                    type: type,
                    typeName: typeName,
                    rate: rate.toFixed(2),
                    price: price.toFixed(2),
                }));
                break;
        }
    },
};

const typeRateMap = {
    'letter-stamped': rateLetterStamped,
    'letter-metered': rateLetterMetered,
    'large-flat': rateLargeFlat,
    'first-class-retail': rateFirstClassRetail,
};

const typeNameMap = {
    'letter-stamped': 'Letter (Stamped)',
    'letter-metered': 'Letter (Metered)',
    'large-flat': 'Large Envelope (Flat)',
    'first-class-retail': 'First-Class Package Service—Retail',
};

function rateLetterStamped(weight) {
    if (weight <= 1.0) {
        return 0.55;
    } else if (weight <= 2.0) {
        return 0.70;
    } else if (weight <= 3.0) {
        return 0.85;
    } else if (weight <= 3.5) {
        return 1.00;
    } else {
        return rateLargeFlat(weight);
    }
}

function rateLetterMetered(weight) {
    if (weight <= 1.0) {
        return 0.50;
    } else if (weight <= 2.0) {
        return 0.65;
    } else if (weight <= 3.0) {
        return 0.80;
    } else if (weight <= 3.5) {
        return 0.95;
    } else {
        return rateLargeFlat(weight);
    }
}

function rateLargeFlat(weight) {
    if (weight <= 1.0) {
        return 1.00;
    } else if (weight <= 2.0) {
        return 1.15;
    } else if (weight <= 3.0) {
        return 1.30;
    } else if (weight <= 4.0) {
        return 1.45;
    } else if (weight <= 5.0) {
        return 1.60;
    } else if (weight <= 6.0) {
        return 1.75;
    } else if (weight <= 7.0) {
        return 1.90;
    } else if (weight <= 8.0) {
        return 2.05;
    } else if (weight <= 9.0) {
        return 2.20;
    } else if (weight <= 10.0) {
        return 2.35;
    } else if (weight <= 11.0) {
        return 2.50;
    } else if (weight <= 12.0) {
        return 2.65;
    } else if (weight <= 13.0) {
        return 2.80;
    } else {
        throw `Invalid weight "${weight}"`;
    }
}

function rateFirstClassRetail(weight) {
    if (weight <= 4.0) {
        return 3.66;
    } else if (weight <= 8.0) {
        return 4.39;
    } else if (weight <= 12.0) {
        return 5.19;
    } else if (weight <= 13.0) {
        return 5.71;
    } else {
        throw `Invalid weight "${weight}"`;
    }
}

function calculateData(weight, type) {
    if (!(type in typeRateMap)) {
        throw `Unknown type "${type}"`;
    } else if (isNaN(weight) || weight <= 0) {
        throw `Invalid weight "${weight}"`;
    }

    let getRate = typeRateMap[type];
    let rate = getRate(weight);
    let typeName = typeNameMap[type];
    return [rate, rate * weight, typeName];
}

function respond(res, obj) {
    res.status(obj.status);
    for (let key in obj.headers) {
        res.set(key, obj.headers[key]);
    }
    res.send(obj.message);
}