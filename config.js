
const config = {

    server : {
        listen_port: 80
    },

    database: {
        sqlite_filename: "sqlite.db",
        mongo: {
            connection_string: "mongodb://localhost:27017",
            dbname: "Kit"
        },
    },

    score : {
        pull_request: {
            score_per_comment: -7,
            score_per_review_comment: -7,
        },

        commit: {
            score_per_addition: 2,
            score_per_deletion: 0,
            score_per_changed_file: 10,
        }
    }
}

export default config;
