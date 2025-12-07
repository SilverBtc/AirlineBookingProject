// src/models/userModel.js
const supabase = require('../config/supabaseClient');

async function findByEmail(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();  // returns null if not found

    if (error) {
        console.error('findByEmail error', error);
        throw error;
    }
    return data;
}

async function findById(id) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('findById error', error);
        throw error;
    }
    return data;
}

async function createUser({ full_name, email, password_hash, role = 'PASSENGER' }) {
    const { data, error } = await supabase
        .from('users')
        .insert([{ full_name, email, password_hash, role }])
        .select()
        .single();  // returns the inserted row

    if (error) {
        console.error('createUser error', error);
        throw error;
    }
    return data; // contains id, full_name, email, role...
}

module.exports = {
    findByEmail,
    findById,
    createUser
};
