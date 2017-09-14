import { Message, State } from './parser'
import { OverviewRulerLane, Range, TextEditor, TextEditorDecorationType, TextLine } from 'vscode'

import {Window} from './wrapper/vscode'

export class DecorationStyle {
    public constructor (private extensionPath: string = '') {}

    public get(state: string): Object {
        return this[state]();
    }

    public passed(): Object {
        const gutterIconPath = this.gutterIconPath('passed.svg');

        return {
            overviewRulerColor: 'green',
            overviewRulerLane: OverviewRulerLane.Left,
            light: {
                gutterIconPath: gutterIconPath
            },
            dark: {
                gutterIconPath: gutterIconPath
            }
        }
    }
    
    public failed(): Object {
        const gutterIconPath = this.gutterIconPath('failed.svg');

        return {
            overviewRulerColor: 'red',
            overviewRulerLane: OverviewRulerLane.Left,
            light: {
                gutterIconPath: gutterIconPath,
            },
            dark: {
                gutterIconPath: gutterIconPath, 
            },
        }
    }
    
    public skipped(): Object {
        const gutterIconPath = this.gutterIconPath('skipped.svg');

        return {
            overviewRulerColor: 'darkgrey',
            overviewRulerLane: OverviewRulerLane.Left,
            dark: {
                gutterIconPath: gutterIconPath,
            },
            light: {
                gutterIconPath: gutterIconPath,
            },
        }
    }
    
    public incompleted(): Object {
        return this.skipped()
    }

    public assertion(): Object {
        return {
            isWholeLine: true,
            overviewRulerColor: 'red',
            overviewRulerLane: OverviewRulerLane.Left,
            light: {
                before: {
                    color: '#FF564B',
                },
            },
            dark: {
                before: {
                    color: '#AD322D',
                },
            },
        }
    }

    private gutterIconPath(img: string) {
        return `${this.extensionPath}/images/${img}`
    }
}

export class DecorateManager {
    private styles: Map<State, TextEditorDecorationType>
    private assertionFails: TextEditorDecorationType[] = []
    public constructor(private decorationStyle: DecorationStyle, private window: Window = new Window) {
        this.styles = [
            State.PASSED,
            State.FAILED,
            State.SKIPPED,
            State.INCOMPLETED,
        ].reduce((styles, state: State) => {
            return styles.set(state, this.window.createTextEditorDecorationType(
                this.decorationStyle.get(state)
            ))
        }, new Map<State, TextEditorDecorationType>())
    }

    public decorateGutter(editor: TextEditor, messageGroup: Map<State, Message[]>) {
        this.clearDecoratedGutter(editor);

        messageGroup.forEach((messages: Message[], state) => {
            editor.setDecorations(
                this.styles.get(state),
                messages.map(message => {
                    return {
                        range: new Range(message.lineNumber, 0, message.lineNumber, 0),
                        hoverMessage: message.state,
                    }
                })
            )
        })
        
        messageGroup.get(State.FAILED).forEach((message: Message) => {
            const textLine: TextLine = editor.document.lineAt(message.lineNumber)
            const assertionStyle = this.window.createTextEditorDecorationType(
                this.decorationStyle.get('assertion')
            )
            editor.setDecorations(assertionStyle, [{
                range: new Range(
                    textLine.lineNumber, 
                    textLine.firstNonWhitespaceCharacterIndex, 
                    textLine.lineNumber, 
                    textLine.text.trim().length
                ),
                hoverMessage: message.error.message,
            }])
            this.assertionFails.push(assertionStyle)
        });
    }

    private clearDecoratedGutter(editor: TextEditor) {
        for (const state of this.styles.keys()) {
            editor.setDecorations(this.styles.get(state), [])
        }

        this.assertionFails.forEach(decorationStyle => editor.setDecorations(decorationStyle, []))
        this.assertionFails = [];
    }
}