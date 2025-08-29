
module.exports = {
    lunchApp: {
        input: {
            target: 'http://127.0.0.1:3000/documentation/json'
        },
        output: {
            workspace: 'src/',
            target: './api/lunch-app',
            // schemas: './api/model',
            client: 'react-query',
            httpClient: 'axios',
            prettier: true,
            fileExtension: '.ts',
            clear: true,
            indexFiles: false,
            mode: 'tags',
            namingConvention: 'kebab-case',

            override: {
                mutator: {
                    path: './api/mutators/axios-instance.ts',
                    name: 'axiosInstance',
                }
            }
        }
    }
}