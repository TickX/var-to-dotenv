import * as core from '@actions/core'
import * as fs from "fs";
import dotenv, { DotenvParseOutput } from "dotenv";

interface Variable {
    key: string
    value: string
    defaultValue: string
    filePath: string
    isNullable: boolean
}

export const write = (variable: Variable): void => {
    let value = variable.value !== '' ? variable.value : variable.defaultValue;
    if (value === '') {
        if (!variable.isNullable) {
            core.info(`Skipping '${variable.key}' as it is not nullable and has no value`);
            return;
        }

        core.info(`Writing empty variable '${variable.key}'`);
    } else {
        core.setSecret(value);
    }

    core.exportVariable(variable.key, value);

    let content: DotenvParseOutput = {[variable.key]: value};
    if (fs.existsSync(variable.filePath)) {
        content = {...dotenv.parse(fs.readFileSync(variable.filePath)), ...content};
    }

    const envVars = Object.entries(content)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync(variable.filePath, envVars);
};

try {
    write({
        key: core.getInput('key'),
        value: core.getInput('value'),
        defaultValue: core.getInput('default'),
        filePath: core.getInput('envPath'),
        isNullable: core.getInput('nullable') === 'true'
    });
} catch (error) {
    core.setFailed(error);
}
