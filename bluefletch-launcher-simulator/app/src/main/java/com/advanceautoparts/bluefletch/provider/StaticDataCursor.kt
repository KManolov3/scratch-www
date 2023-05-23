package com.advanceautoparts.bluefletch.provider

import android.database.AbstractCursor

data class ColumnDefinition(
    val name: String,
    val type: Int
)

class StaticDataCursor(
    private val columns: List<ColumnDefinition>,
    private val rows: List<List<Any>>
) : AbstractCursor() {
    override fun getCount(): Int {
        return rows.size
    }

    override fun getType(column: Int): Int {
        return columns[column].type
    }

    override fun getColumnNames(): Array<String> {
        return columns.map { it.name }.toTypedArray()
    }

    override fun getString(column: Int): String {
        return rows[position][column].toString()
    }

    override fun getShort(column: Int): Short {
        return rows[position][column] as Short
    }

    override fun getInt(column: Int): Int {
        return rows[position][column] as Int
    }

    override fun getLong(column: Int): Long {
        return rows[position][column] as Long
    }

    override fun getFloat(column: Int): Float {
        return rows[position][column] as Float
    }

    override fun getDouble(column: Int): Double {
        return rows[position][column] as Double
    }

    override fun isNull(column: Int): Boolean {
        return rows[position][column] as Boolean
    }
}
