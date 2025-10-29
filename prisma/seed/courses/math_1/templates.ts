import * as fs from 'fs'

export interface Instance {
	answerOptions: string[]
	correctAnswer: string
	variables: Record<string, number>
}
// TODO: Replace the absolute path from env with a dynamic __dirname resolution once the issue is fixed.
const templatesDir = `${process.env.PROJECT_PATH}/prisma/seed/courses/math_1/instances`

export function loadInstance(fileName: string): Instance[] {
	const filePath = `${templatesDir}/${fileName}`
	const data = fs.readFileSync(filePath, 'utf-8')
	return JSON.parse(data) as Instance[]
}

export const firstTemplate = {
	text: 'Один станок работал {a} часа, изготавливая каждый час по {b} деталей. Менее мощный станок работал {c} часа, изготавливая по {d} деталей в час. Сколько всего деталей изготовили эти станки?',
	explanation: '{explanation}',
	instances: loadInstance('01.json'),
}

export const secondTemplate = {
	text: 'У Сони {a} альбома с наклейками по {b} наклеек в каждом, а у её сестры {c} альбома по {d} наклеек в каждом. Сколько всего наклеек у двух сестёр?',
	explanation: '{explanation}',
	instances: loadInstance('02.json'),
}

export const thirdTemplate = {
	text: 'К пристани причалили {a} теплохода, на каждом из которых было по {b} человек, и {c} теплохода, на каждом из которых было по {d} человек. Сколько всего человек привезли теплоходы?',
	explanation: '{explanation}',
	instances: loadInstance('03.json'),
}

export const fourthTemplate = {
	text: 'Утром с вокзала отправили {a} поездов по {b} человек в каждом поезде, а днём – {c} поездов по {d} человек в каждом. Сколько всего человек уехало утром и днём?',
	explanation: '{explanation}',
	instances: loadInstance('04.json'),
}

export const fifthTemplate = {
	text: 'В первый день в санаторий приехали {a} человек, а во второй – в {b} раз меньше, чем в первый. Всех отдыхающих поселили в комнаты по {c} человека в каждой. Сколько комнат заняли отдыхающие?',
	explanation: '{explanation}',
	instances: loadInstance('05.json'),
}

export const sixthTemplate = {
	text: 'На кондитерской фабрике сделали пирожные: {a} трубочек с кремом, а эклеров в {b} раз меньше. Все пирожные разложили в коробки по {c} штук в каждую. Сколько коробок заняли эти пирожные?',
	explanation: '{explanation}',
	instances: loadInstance('06.json'),
}

export const seventhTemplate = {
	text: 'На корм одного десятка кроликов в день расходовали {a} кг травы. Сколько израсходуют травы на корм {b} кроликов за {c} дней?',
	explanation: '{explanation}',
	instances: loadInstance('07.json'),
}

export const eighthTemplate = {
	text: 'В трёх классах было {a} учеников, они построились в ряды по {b} человек в каждом. Сколько получилось полных рядов? Сколько учеников в неполном ряду?',
	explanation: '{explanation}',
	instances: loadInstance('08.json'),
}

export const ninthTemplate = {
	text: 'Из {a} листов бумаги сделали тетради, истратив по {b} листов на каждую. Сколько получилось тетрадей и сколько бумаги осталось?',
	explanation: '{explanation}',
	instances: loadInstance('09.json'),
}

export const tenthTemplate = {
	text: 'В актовом зале нужно разместить {a} класса по {b} учащихся, {c} класса по {d} учащихся и {e} классов по {f} учащихся. В зале расставляют стулья по {g} в каждом ряду. Сколько потребуется рядов?',
	explanation: '{explanation}',
	instances: loadInstance('10.json'),
}
