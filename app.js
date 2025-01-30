import express from 'express';
import mysql2 from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nwind',
};

const db = mysql2.createPool(conn);

app.get('/customers', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM customers');
        res.render('customers', { customers: result });
    } catch (err) {
        console.error('Error mengambil data customers:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/detail/:id', async (req, res) => {
    const customersId = req.params.id;
    try {
        const [result] = await db.query('SELECT * FROM customers WHERE CustomerID = ?', [customersId]);
        if (result.length > 0) {
            const cust = result[0];
            res.render('detail', { cust });
        } else {
            res.status(404).send('Customer not found');
        }
    } catch (err) {
        console.error('Error mengambil data customer:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});
