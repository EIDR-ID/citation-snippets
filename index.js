const express = require('express')
const { cite, convertToCslJson } = require('./citation');

const app = express()
const port = 3000

app.get('/', async (req, res) => {

    let style = 'apa';
    let locale = 'en-US'
    let html = false;
    let response;

    let fakeData = {
        "ID": "10.5240/DDFD-BE56-820F-AFFC-0766-W",
        "StructuralType": "Abstraction",
        "Mode": "AudioVisual",
        "ReferentType": "TV",
        "ResourceName": {
            "value": "Dipper vs. Manliness",
            "_lang": "en"
        },
        "OriginalLanguage": [
            {
                "value": "en",
                "_mode": "Audio"
            }
        ],
        "AssociatedOrg": [
            {
                "_idType": "EIDRPartyID",
                "_organizationID": "10.5237/1717-7197",
                "_role": "producer",
                "DisplayName": "Disney Channel",
                "AlternateName": [
                    "Disney Channel Original Programming",
                    "Disney Channel Productions"
                ]
            }
        ],
        "ReleaseDate": "2012-07-20",
        "CountryOfOrigin": [
            "US"
        ],
        "Status": "valid",
        "ApproximateLength": "PT30M",
        "AlternateID": [
            {
                "value": "124337",
                "_domain": "disney.com/ProductID",
                "_type": "Proprietary"
            },
            {
                "value": "2/2547/0006",
                "_domain": "itv.com",
                "_type": "Proprietary"
            },
            {
                "value": "See-TiVo",
                "_domain": "tivo.com",
                "_relation": "Other",
                "_type": "Proprietary"
            }
        ],
        "Administrators": {
            "Registrant": "10.5237/AD45-F060"
        },
        "Credits": {
            "Actor": [
                {
                    "DisplayName": "Alex Hirsch"
                },
                {
                    "DisplayName": "Jason Ritter"
                },
                {
                    "DisplayName": "Kristen Schaal"
                }
            ]
        },
        "ExtraObjectMetadata": {
            "EpisodeInfo": {
                "Parent": "10.5240/7ABD-CE20-521D-E9E5-B518-S",
                "SequenceInfo": {
                    "DistributionNumber": {
                        "value": "6"
                    }
                },
                "EpisodeClass": [
                    "Main"
                ]
            }
        }
    }

    let acceptHeaders = req.headers.accept;
    if (acceptHeaders.indexOf('vnd.citationstyles.csl+json') !== -1) {
        response = convertToCslJson(fakeData);
    } else {
        let acceptTextArr = acceptHeaders.split(';');
        acceptTextArr.forEach(acceptText => {
            let text = acceptText.trim();
            if (text.startsWith('style=')) {
                style = text.replace('style=', '') || 'apa';
            }
            if (text.startsWith('locale=')) {
                locale = text.replace('locale=', '') || 'en-US';
            }

            if (text.startsWith('html=')) {
                html = text.replace('html=', '') === 'true' || false;
            }
        })
        response = await cite(fakeData, style, locale, html)
    }
    res.send(response);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})