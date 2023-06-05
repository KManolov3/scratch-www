package com.advanceautoparts.rtninstoreapps.auth

import com.okta.authfoundation.credential.TokenStorage

class InMemoryOktaTokenStorage : TokenStorage {
    private val tokens = mutableMapOf<String, TokenStorage.Entry>()

    override suspend fun add(id: String) {
        tokens[id] = TokenStorage.Entry(id, null, emptyMap())
    }

    override suspend fun entries() = tokens.values.toList()

    override suspend fun remove(id: String) {
        tokens.remove(id)
    }

    override suspend fun replace(updatedEntry: TokenStorage.Entry) {
        tokens[updatedEntry.identifier] = updatedEntry
    }
}