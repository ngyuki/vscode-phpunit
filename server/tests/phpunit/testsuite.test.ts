import { Test, Type, Testsuite } from '../../src/phpunit';
import { TextDocument, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { projectPath, pathPattern } from '../helpers';
import { FilesystemContract, Filesystem } from '../../src/filesystem';

describe('Testsuite Test', () => {
    const files: FilesystemContract = new Filesystem();
    const testsuite: Testsuite = new Testsuite();
    beforeEach(async () => {
        const content: string = await files.get(projectPath('junit.xml'));
        await testsuite.parseJUnit(
            content.replace(pathPattern, (...m) => {
                return projectPath(m[1]);
            })
        );
    });

    it('it should get diagnostics', () => {
        expect(testsuite.getDiagnostics()).toEqual(
            new Map<string, any>([
                [
                    files.uri(projectPath('tests/AssertionsTest.php')),
                    {
                        diagnostics: [
                            {
                                message: 'Failed asserting that false is true.',
                                range: {
                                    end: {
                                        character: 33,
                                        line: 15,
                                    },
                                    start: {
                                        character: 8,
                                        line: 15,
                                    },
                                },
                                severity: 1,
                                source: 'phpunit',
                            },
                            {
                                message:
                                    "Failed asserting that two arrays are identical.\n--- Expected\n+++ Actual\n@@ @@\n Array &0 (\n-    'a' => 'b'\n-    'c' => 'd'\n+    'e' => 'f'\n+    0 => 'g'\n+    1 => 'h'\n )",
                                range: {
                                    end: {
                                        character: 76,
                                        line: 20,
                                    },
                                    start: {
                                        character: 8,
                                        line: 20,
                                    },
                                },
                                severity: 1,
                                source: 'phpunit',
                            },
                        ],
                        uri: files.uri(projectPath('tests/AssertionsTest.php')),
                    },
                ],
                [
                    files.uri(projectPath('tests/CalculatorTest.php')),
                    {
                        diagnostics: [
                            {
                                message:
                                    'Mockery\\Exception\\InvalidCountException: Method test(<Any Arguments>) from Mockery_0_App_Item_App_Item should be called\n exactly 1 times but called 0 times.',
                                range: {
                                    end: {
                                        character: 19,
                                        line: 14,
                                    },
                                    start: {
                                        character: 8,
                                        line: 14,
                                    },
                                },
                                severity: 1,
                                source: 'phpunit',
                            },
                            {
                                message: 'Failed asserting that 4 is identical to 3.',
                                range: {
                                    end: {
                                        character: 53,
                                        line: 28,
                                    },
                                    start: {
                                        character: 8,
                                        line: 28,
                                    },
                                },
                                severity: 1,
                                source: 'phpunit',
                            },
                            {
                                message: '',
                                range: {
                                    end: {
                                        character: 38,
                                        line: 56,
                                    },
                                    start: {
                                        character: 8,
                                        line: 56,
                                    },
                                },
                                severity: 1,
                                source: 'phpunit',
                            },
                        ],
                        uri: files.uri(projectPath('tests/CalculatorTest.php')),
                    },
                ],
            ])
        );
    });

    it('it should get assertions', () => {
        expect(testsuite.getAssertions(files.uri(projectPath('tests/AssertionsTest.php')))).toEqual([
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: null,
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 9,
                name: 'test_passed',
                range: {
                    end: {
                        character: 33,
                        line: 8,
                    },
                    start: {
                        character: 4,
                        line: 8,
                    },
                },
                time: 0.007537,
                type: 'passed',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: 'Failed asserting that false is true.',
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 16,
                name: 'test_error',
                range: {
                    end: {
                        character: 33,
                        line: 15,
                    },
                    start: {
                        character: 8,
                        line: 15,
                    },
                },
                time: 0.001508,
                type: 'failure',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message:
                        "Failed asserting that two arrays are identical.\n--- Expected\n+++ Actual\n@@ @@\n Array &0 (\n-    'a' => 'b'\n-    'c' => 'd'\n+    'e' => 'f'\n+    0 => 'g'\n+    1 => 'h'\n )",
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 21,
                name: 'test_assertion_isnt_same',
                range: {
                    end: {
                        character: 76,
                        line: 20,
                    },
                    start: {
                        character: 8,
                        line: 20,
                    },
                },
                time: 0.001332,
                type: 'failure',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: 'Risky Test',
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 24,
                name: 'test_risky',
                range: {
                    end: {
                        character: 32,
                        line: 23,
                    },
                    start: {
                        character: 4,
                        line: 23,
                    },
                },
                time: 0.000079,
                type: 'risky',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: null,
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 32,
                name: 'it_should_be_annotation_test',
                range: {
                    end: {
                        character: 50,
                        line: 31,
                    },
                    start: {
                        character: 4,
                        line: 31,
                    },
                },
                time: 0.000063,
                type: 'passed',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: '',
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 37,
                name: 'test_skipped',
                range: {
                    end: {
                        character: 34,
                        line: 36,
                    },
                    start: {
                        character: 4,
                        line: 36,
                    },
                },
                time: 0.000664,
                type: 'skipped',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: '',
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 42,
                name: 'test_incomplete',
                range: {
                    end: {
                        character: 37,
                        line: 41,
                    },
                    start: {
                        character: 4,
                        line: 41,
                    },
                },
                time: 0.000693,
                type: 'skipped',
            },
            {
                class: 'Tests\\AssertionsTest',
                classname: 'Tests.AssertionsTest',
                fault: {
                    message: 'Risky Test',
                },
                file: projectPath('tests/AssertionsTest.php'),
                line: 47,
                name: 'test_no_assertion',
                range: {
                    end: {
                        character: 39,
                        line: 46,
                    },
                    start: {
                        character: 4,
                        line: 46,
                    },
                },
                time: 0.000047,
                type: 'risky',
            },
        ]);
    });
});