﻿var express = require('express'),
    fs = require('fs'),
    url = require('url'),
    server = express();

server.use(express.static(__dirname));

server.get('/DataSources/GetPlayers', function (req, res) {
    var params, data, result, startInd, page, limit;

    params = url.parse(req.url, true).query;
    data = [
		{ 'ID': '1', 'Name': 'Hristo Stoichkov', 'PlaceOfBirth': 'Plovdiv, Bulgaria', 'DateOfBirth': '\/Date(-122954400000)\/', 'IsActive': false },
		{ 'ID': '2', 'Name': 'Ronaldo Luís Nazário de Lima', 'PlaceOfBirth': 'Rio de Janeiro, Brazil', 'DateOfBirth': '\/Date(211842000000)\/', 'IsActive': false },
		{ 'ID': '3', 'Name': 'David Platt', 'PlaceOfBirth': 'Chadderton, Lancashire, England', 'DateOfBirth': '\/Date(-112417200000)\/', 'IsActive': false },
		{ 'ID': '4', 'Name': 'Manuel Neuer', 'PlaceOfBirth': 'Gelsenkirchen, West Germany', 'DateOfBirth': '\/Date(512258400000)\/', 'IsActive': true },
		{ 'ID': '5', 'Name': 'James Rodríguez', 'PlaceOfBirth': 'Cúcuta, Colombia', 'DateOfBirth': '\/Date(679266000000)\/', 'IsActive': true },
		{ 'ID': '6', 'Name': 'Dimitar Berbatov', 'PlaceOfBirth': 'Blagoevgrad, Bulgaria', 'DateOfBirth': '\/Date(349653600000)\/', 'IsActive': true },
		{ 'ID': '7', 'Name': 'Robert Lewandowski', 'PlaceOfBirth': 'Warsaw, Poland', 'DateOfBirth': '\/Date(588168000000)\/', 'IsActive': true }
    ];
    result = [];

    if (params.sortBy && params.direction) {
        if (params.direction === 'asc') {
            data.sort(function compare(a, b) {
                return ((a[params.sortBy] < b[params.sortBy]) ? -1 : ((a[params.sortBy] > b[params.sortBy]) ? 1 : 0));
            });
        } else {
            data.sort(function compare(a, b) {
                return ((a[params.sortBy] > b[params.sortBy]) ? -1 : ((a[params.sortBy] < b[params.sortBy]) ? 1 : 0));
            });
        }
    }

    if (params.searchString) {
        result = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].Name.indexOf(params.searchString) > -1) {
                result.push(data[i]);
            }
        }
        data = result;
    }

    if (params.page && params.limit) {
        page = parseInt(params.page, 10);
        limit = parseInt(params.limit, 10);
        startInd = (page - 1) * limit;
        result = data.slice(startInd, startInd + limit);
    } else {
        result = data;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send({ records: result, total: data.length });
});


server.get('/DataSources/GetCountries', function (req, res) {
    var params, data;

    params = url.parse(req.url, true).query;
    data = [
        {
            id: 1, text: 'Asia', children: [
                { id: 5, text: 'China' },
                { id: 6, text: 'Japan' },
                { id: 7, text: 'Mongolia' }
            ]
        },
        {
            id: 2, text: 'North America', children: [
                {
                    id: 8, text: 'USA', children: [
                        { id: 9, text: 'California', population: 39144818 },
                        { id: 10, text: 'Florida', population: 20271272 }
                    ]
                },
                { id: 11, text: 'Canada' },
                { id: 12, text: 'Mexico' }
            ]
        },
        {
            id: 3, text: 'South America', children: [
                { id: 13, text: 'Brazil' },
                { id: 14, text: 'Argentina' },
                { id: 15, text: 'Columbia' }
            ]
        },
        {
            id: 4, text: 'Europe', children: [
                { id: 16, text: 'France' },
                { id: 17, text: 'Spain' },
                { id: 18, text: 'Italy' }
            ]
        }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});


server.listen(4000);