package com.crms.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // This catches Constraint Violations (like duplicate National IDs)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        // Dig down to find the actual Oracle error message
        Throwable rootCause = ex.getRootCause();
        String message = (rootCause != null) ? rootCause.getMessage() : ex.getMessage();

        // Return it as plain text instead of generic JSON
        return new ResponseEntity<>("DB_REJECTION: " + message, HttpStatus.BAD_REQUEST);
    }

    // This catches raw PL/SQL Exceptions and Triggers
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<String> handleSQLException(SQLException ex) {
        return new ResponseEntity<>("ORACLE_TRIGGER_ERR: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Catch-all for any other weird errors so it doesn't send that ugly JSON
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return new ResponseEntity<>("SYS_ERR: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}