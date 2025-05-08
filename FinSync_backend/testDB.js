const sql = require('mssql');
const config = require('./config/dbConfig');

async function testUserTable() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        console.log('Connected successfully!\n');

        // Check table structure
        const tableStructure = await pool.request().query(`
            SELECT 
                COLUMN_NAME, 
                DATA_TYPE, 
                CHARACTER_MAXIMUM_LENGTH
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'User'
            ORDER BY ORDINAL_POSITION;
        `);

        console.log('Table Structure:');
        tableStructure.recordset.forEach(column => {
            console.log(`${column.COLUMN_NAME}: ${column.DATA_TYPE}${column.CHARACTER_MAXIMUM_LENGTH ? `(${column.CHARACTER_MAXIMUM_LENGTH})` : ''}`);
        });

        // Count existing records
        const countResult = await pool.request().query('SELECT COUNT(*) as count FROM [User]');
        console.log(`\nTotal existing records: ${countResult.recordset[0].count}`);

        // Show sample record if exists
        const sampleResult = await pool.request().query(`
            SELECT TOP 1 
                UserID,
                First_Name,
                Last_Name,
                Email,
                Phone_Number,
                Date_Joined,
                'HIDDEN' as UserPassword
            FROM [User]
        `);

        if (sampleResult.recordset.length > 0) {
            console.log('\nSample record:');
            console.log(sampleResult.recordset[0]);
        }

        await sql.close();
        console.log('\nTest completed successfully');

    } catch (err) {
        console.error('\nError during test:', err);
        if (err.message.includes('Invalid object name')) {
            console.error('\nTable "User" not found. Please verify the table name and permissions.');
        }
    }
}

testUserTable().catch(console.error);