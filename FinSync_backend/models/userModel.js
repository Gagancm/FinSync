// userModel.js
const sql = require('mssql');
const bcrypt = require('bcrypt');
const config = require('../config/dbConfig');

class UserModel {
    async createUser(userData) {
        let pool;
        try {
            console.log('Creating user with data:', {
                ...userData,
                password: '[HIDDEN]'
            });

            pool = await sql.connect(config);
            
            // Check if email exists
            const emailCheck = await pool.request()
                .input('email', sql.VarChar(50), userData.email)
                .query('SELECT UserID FROM [User] WHERE Email = @email');
            
            if (emailCheck.recordset.length > 0) {
                throw new Error('Email already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Insert new user
            const result = await pool.request()
                .input('First_Name', sql.VarChar(25), userData.firstName)
                .input('Last_Name', sql.VarChar(25), userData.lastName)
                .input('Email', sql.VarChar(50), userData.email)
                .input('Phone_Number', sql.VarChar(20), userData.phoneNumber)
                .input('Date_Joined', sql.Date, new Date())
                .input('UserPassword', sql.VarChar(255), hashedPassword)
                .query(`
                    INSERT INTO [User] (
                        First_Name, 
                        Last_Name, 
                        Email, 
                        Phone_Number, 
                        Date_Joined, 
                        UserPassword
                    )
                    OUTPUT 
                        INSERTED.UserID,
                        INSERTED.First_Name,
                        INSERTED.Last_Name,
                        INSERTED.Email,
                        INSERTED.Phone_Number,
                        INSERTED.Date_Joined
                    VALUES (
                        @First_Name,
                        @Last_Name,
                        @Email,
                        @Phone_Number,
                        @Date_Joined,
                        @UserPassword
                    );
                `);

            console.log('User created successfully');
            return result.recordset[0];

        } catch (error) {
            console.error('Error in createUser:', error);
            if (error.message.includes('Email already exists')) {
                throw error;
            }
            throw new Error('Failed to create user: ' + error.message);
        } finally {
            if (pool) {
                try {
                    await pool.close();
                } catch (err) {
                    console.error('Error closing connection:', err);
                }
            }
        }
    }

    async findUserByEmail(email) {
        let pool;
        try {
            pool = await sql.connect(config);
            
            const result = await pool.request()
                .input('email', sql.VarChar(50), email)
                .query(`
                    SELECT * FROM [User]
                    WHERE Email = @email
                `);

            return result.recordset[0];

        } catch (error) {
            console.error('Error in findUserByEmail:', error);
            throw new Error('Failed to find user: ' + error.message);
        } finally {
            if (pool) {
                try {
                    await pool.close();
                } catch (err) {
                    console.error('Error closing connection:', err);
                }
            }
        }
    }

    async updateUser(userId, userData) {
        let pool;
        try {
            pool = await sql.connect(config);
            
            let updateFields = [];
            let queryInputs = {};
            
            if (userData.email !== undefined) {
                updateFields.push('Email = @Email');
                queryInputs.Email = { type: sql.VarChar(50), value: userData.email };
            }
            
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                updateFields.push('UserPassword = @UserPassword');
                queryInputs.UserPassword = { type: sql.VarChar(255), value: hashedPassword };
            }
            
            if (userData.firstName !== undefined) {
                updateFields.push('First_Name = @FirstName');
                queryInputs.FirstName = { type: sql.VarChar(25), value: userData.firstName };
            }
            
            if (userData.lastName !== undefined) {
                updateFields.push('Last_Name = @LastName');
                queryInputs.LastName = { type: sql.VarChar(25), value: userData.lastName };
            }
            
            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }
            
            const request = pool.request();
            
            for (const [key, input] of Object.entries(queryInputs)) {
                request.input(key, input.type, input.value);
            }
            
            request.input('UserId', sql.Int, userId);
            
            const query = `
                UPDATE [User]
                SET ${updateFields.join(', ')}
                OUTPUT 
                    INSERTED.UserID,
                    INSERTED.First_Name,
                    INSERTED.Last_Name,
                    INSERTED.Email,
                    INSERTED.Phone_Number,
                    INSERTED.Date_Joined
                WHERE UserID = @UserId;
            `;
            
            const result = await request.query(query);
            
            if (result.recordset.length === 0) {
                throw new Error('User not found');
            }
            
            return result.recordset[0];
            
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw new Error('Failed to update user: ' + error.message);
        } finally {
            if (pool) {
                try {
                    await pool.close();
                } catch (err) {
                    console.error('Error closing connection:', err);
                }
            }
        }
    }

    async deleteUser(userId) {
        let pool;
        try {
            pool = await sql.connect(config);
            
            const result = await pool.request()
                .input('UserId', sql.Int, userId)
                .query(`
                    DELETE FROM [User]
                    WHERE UserID = @UserId;
                `);

            if (result.rowsAffected[0] === 0) {
                throw new Error('User not found');
            }

            return true;

        } catch (error) {
            console.error('Error in deleteUser:', error);
            throw new Error('Failed to delete user: ' + error.message);
        } finally {
            if (pool) {
                try {
                    await pool.close();
                } catch (err) {
                    console.error('Error closing connection:', err);
                }
            }
        }
    }
}

module.exports = new UserModel();