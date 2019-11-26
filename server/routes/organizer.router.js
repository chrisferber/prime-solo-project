const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {
    const queryText = `SELECT * FROM "event"
    WHERE "created_id" = $1`;

    const queryValues = [ req.user.id ];

    pool.query(queryText, queryValues)
        .then((result) => { 
            res.send(result.rows) 
        })
        .catch((error) => {
            console.log('error in organizer.router.js in making GET request', error);
            res.sendStatus(500);
        })
});

router.get('/attending/:id', (req, res) => {
    const queryText = `SELECT "user"."username", "user"."email", "user_event"."user_id", "user_event"."event_id", "user_event"."registration_complete", "make", "model", "year" FROM "user"
    INNER JOIN "user_event" ON "user_event"."user_id" = "user"."id"
    INNER JOIN "vehicle" ON "vehicle"."user_id" = "user"."id"
    WHERE "user_event"."event_id" = $1
    ORDER BY "user"."id"`
    ;
    console.log('req.params.id for /attending get in organizer.router.js:', req.params.id);

    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('result.rows for /attending get in organizer.router.js:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in organizer.router.js in /attending GET request', error);
        })
});

router.put('/complete-registration', (req, res) => {
    pool.query(`SELECT * FROM "event" WHERE "id" = $1`, [req.body.event_id])
    .then((result) => {
        const admin = result.rows[0].created_id;
        if(admin === req.user.id) {
            const queryText = `UPDATE "user_event"
            SET "registration_complete" = true
            WHERE "user_id" = $1
            AND "event_id" = $2`;
            const queryValues = [
                req.body.user_id,
                req.body.event_id
            ];
            pool.query(queryText, queryValues)
            .then(() => {
                res.send([req.body.event_id]);
            })
            .catch((error) => {
                console.log('put request to /complete-registration in organizer.router.js failed with:', error);
                res.sendStatus(500);
            })
        } else {
            console.log('user is not authorized to post to /complete-registration for this user or event');
        }
    })
})

router.put('/registration-incomplete', (req, res) => {
    pool.query(`SELECT * FROM "event" WHERE "id" = $1`, [req.body.event_id])
    .then((result) => {
        const admin = result.rows[0].created_id;
        if(admin === req.user.id) {
            const queryText = `UPDATE "user_event"
            SET "registration_complete" = false
            WHERE "user_id" = $1
            AND "event_id" = $2`;
            const queryValues = [
                req.body.user_id,
                req.body.event_id
            ];
            pool.query(queryText, queryValues)
            .then(() => {
                res.send([req.body.event_id]);
            })
            .catch((error) => {
                console.log('put request to /complete-registration in organizer.router.js failed with:', error);
                res.sendStatus(500);
            })
        } else {
            console.log('user is not authorized to post to /registration-incomplete for this user or event');
        }
    })
})


module.exports = router;