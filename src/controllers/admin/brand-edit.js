var brandDAO = require('../../dao/brand');
var productDAO = require('../../dao/product');

var ObjectId = require('mongodb').ObjectId;

module.exports = 
{
	index: function(req, res, next)
	{
		var { _id, startPage, page, perPage } = req.query;

		startPage = (startPage == undefined) ? 1 : parseInt(startPage);
		page = (page == undefined) ? 1 : parseInt(page);
		perPage = (perPage == undefined) ? 10 : parseInt(perPage);

		var start = (page - 1) * perPage;
		var end = page * perPage;

		brandDAO.find({ _id: ObjectId(_id) }, function(brands)
		{
			productDAO.find({ brandId: _id }, function(products)
			{
				res.render('admin/brand-edit.pug', 
				{
					brand: brands[0],
					products: products.slice(start, end),
					startPage: startPage,
					page: page,
					perPage: perPage
				});
			});
		});
	},
	indexPost: function(req, res, next) 
	{
		var { _id, startPage, page, perPage } = req.query;
		var { name } = req.body;

		var errors = [];
		
		if(!name)
		{
			errors.push('You forget some fields :(');
		}

		if(errors.length > 0)
		{
			startPage = (startPage == undefined) ? 1 : parseInt(startPage);
			page = (page == undefined) ? 1 : parseInt(page);
			perPage = (perPage == undefined) ? 10 : parseInt(perPage);

			var start = (page - 1) * perPage;
			var end = page * perPage;

			brandDAO.find({ _id: ObjectId(_id) }, function(brands)
			{
				productDAO.find({ brandId: _id }, function(products)
				{
					res.render('admin/brand-edit.pug', 
					{
						brand: brands[0],
						products: products.slice(start, end),
						startPage: startPage,
						page: page,
						perPage: perPage,
						errors: errors,
						values: req.body
					});
				});
			});
		}
		else
		{
			brandDAO.update({ _id: ObjectId(_id) }, { $set: { name: name } }, function(result)
			{
				req.flash('success_msg', 'Updated successful :)');

	            res.redirect('/admin-brand-edit.html?_id=' + _id);
			});
		}
	}
};