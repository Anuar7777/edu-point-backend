import * as fs from 'fs'

export interface Instance {
	answerOptions: string[]
	correctAnswer: string
	variables: Record<string, number>
}

const templatesDir = `${process.cwd()}/prisma/seed/courses/math_1/instances`

export function loadInstance(fileName: string): Instance[] {
	const filePath = `${templatesDir}/${fileName}`
	const data = fs.readFileSync(filePath, 'utf-8')
	return JSON.parse(data) as Instance[]
}

export const firstTemplate = {
	text_en:
		'One machine worked for {a} hours producing {b} parts per hour. A less powerful machine worked for {c} hours producing {d} parts per hour. How many parts did they produce in total?',
	text_ru:
		'Один станок работал {a} часа, изготавливая каждый час по {b} деталей. Менее мощный станок работал {c} часа, изготавливая по {d} деталей в час. Сколько всего деталей изготовили эти станки?',
	text_kz:
		'Бір станок {a} сағат жұмыс істеп, сағатына {b} бөлшек жасады. Әлсіз станок {c} сағат жұмыс істеп, сағатына {d} бөлшек жасады. Барлығы неше бөлшек жасалды?',
	explanation: '{explanation}',
	instances: loadInstance('01.json'),
}

export const secondTemplate = {
	text_en:
		'Sonya has {a} sticker albums with {b} stickers in each, and her sister has {c} albums with {d} stickers in each. How many stickers do the sisters have in total?',
	text_ru:
		'У Сони {a} альбома с наклейками по {b} наклеек в каждом, а у её сестры {c} альбома по {d} наклеек в каждом. Сколько всего наклеек у двух сестёр?',
	text_kz:
		'Соняның {a} жапсырма альбомы бар, әрқайсысында {b} жапсырма. Оның әпкесінің {c} альбомы бар, әрқайсысында {d} жапсырма. Екі қызда барлығы қанша жапсырма бар?',
	explanation: '{explanation}',
	instances: loadInstance('02.json'),
}

export const thirdTemplate = {
	text_en:
		'{a} ships arrived at the pier, each carrying {b} passengers, and {c} other ships, each carrying {d} passengers. How many passengers arrived in total?',
	text_ru:
		'К пристани причалили {a} теплохода, на каждом из которых было по {b} человек, и {c} теплохода, на каждом из которых было по {d} человек. Сколько всего человек привезли теплоходы?',
	text_kz:
		'{a} кемелер айлаққа келді, әрқайсысында {b} жолаушы бар, және тағы {c} кеме, әрқайсысында {d} жолаушы. Барлығы қанша жолаушы келді?',
	explanation: '{explanation}',
	instances: loadInstance('03.json'),
}

export const fourthTemplate = {
	text_en:
		'In the morning, {a} trains left the station with {b} passengers each, and in the afternoon – {c} trains with {d} passengers each. How many passengers left the station in total?',
	text_ru:
		'Утром с вокзала отправили {a} поездов по {b} человек в каждом поезде, а днём – {c} поездов по {d} человек в каждом. Сколько всего человек уехало утром и днём?',
	text_kz:
		'Таңертең вокзалдан {a} пойыз жөнелді, әрқайсысында {b} жолаушы бар, ал түстен кейін – {c} пойыз, әрқайсысында {d} жолаушы бар. Барлығы қанша жолаушы кетті?',
	explanation: '{explanation}',
	instances: loadInstance('04.json'),
}

export const fifthTemplate = {
	text_en:
		'On the first day, {a} people arrived at the resort, and on the second day – {b} times fewer than on the first day. All guests were placed in rooms with {c} people each. How many rooms were occupied?',
	text_ru:
		'В первый день в санаторий приехали {a} человек, а во второй – в {b} раз меньше, чем в первый. Всех отдыхающих поселили в комнаты по {c} человека в каждой. Сколько комнат заняли отдыхающие?',
	text_kz:
		'Бірінші күні санаторийге {a} адам келді, ал екінші күні – одан {b} есе аз. Барлық демалушыларды әрқайсысында {c} адамнан бөлмелерге орналастырды. Барлығы қанша бөлме толды?',
	explanation: '{explanation}',
	instances: loadInstance('05.json'),
}

export const sixthTemplate = {
	text_en:
		'At the confectionery factory, they made {a} cream rolls and {b} times fewer éclairs. All pastries were packed into boxes of {c} pieces each. How many boxes were needed?',
	text_ru:
		'На кондитерской фабрике сделали пирожные: {a} трубочек с кремом, а эклеров в {b} раз меньше. Все пирожные разложили в коробки по {c} штук в каждую. Сколько коробок заняли эти пирожные?',
	text_kz:
		'Кондитер фабрикасында {a} кілегейлі түтікше және {b} есе аз эклер жасалды. Барлық тәттілерді әрқайсысында {c} данадан қораптарға салды. Барлығы неше қорап керек болды?',
	explanation: '{explanation}',
	instances: loadInstance('06.json'),
}

export const seventhTemplate = {
	text_en:
		'One dozen rabbits eat {a} kg of grass per day. How much grass will {b} rabbits eat in {c} days?',
	text_ru:
		'На корм одного десятка кроликов в день расходовали {a} кг травы. Сколько израсходуют травы на корм {b} кроликов за {c} дней?',
	text_kz:
		'Он қоянға күніне {a} кг шөп қажет. {b} қоянға {c} күнге қанша шөп керек?',
	explanation: '{explanation}',
	instances: loadInstance('07.json'),
}

export const eighthTemplate = {
	text_en:
		'There were {a} students in three classes. They lined up in rows of {b} students each. How many full rows were formed? How many students were left in the incomplete row?',
	text_ru:
		'В трёх классах было {a} учеников, они построились в ряды по {b} человек в каждом. Сколько получилось полных рядов? Сколько учеников в неполном ряду?',
	text_kz:
		'Үш сыныпта {a} оқушы болды. Олар әр қатарда {b} оқушыдан тұрып сап түзеді. Неше толық қатар шықты? Толық емес қатарда неше оқушы қалды?',
	explanation: '{explanation}',
	instances: loadInstance('08.json'),
}

export const ninthTemplate = {
	text_en:
		'{a} sheets of paper were used to make notebooks, {b} sheets for each notebook. How many notebooks were made and how many sheets were left?',
	text_ru:
		'Из {a} листов бумаги сделали тетради, истратив по {b} листов на каждую. Сколько получилось тетрадей и сколько бумаги осталось?',
	text_kz:
		'{a} парақ қағаздан дәптер жасалды, әр дәптерге {b} парақ кетті. Барлығы неше дәптер жасалды және қанша қағаз қалды?',
	explanation: '{explanation}',
	instances: loadInstance('09.json'),
}

export const tenthTemplate = {
	text_en:
		'In the assembly hall, you need to seat {a} classes with {b} students each, {c} classes with {d} students each, and {e} classes with {f} students each. The chairs are arranged in rows of {g} chairs each. How many rows are needed?',
	text_ru:
		'В актовом зале нужно разместить {a} класса по {b} учащихся, {c} класса по {d} учащихся и {e} классов по {f} учащихся. В зале расставляют стулья по {g} в каждом ряду. Сколько потребуется рядов?',
	text_kz:
		'Мектеп акт залында {a} сыныпта {b} оқушыдан, {c} сыныпта {d} оқушыдан және {e} сыныпта {f} оқушыдан орналастыру керек. Әр қатарда {g} орындық бар. Барлығы неше қатар керек?',
	explanation: '{explanation}',
	instances: loadInstance('10.json'),
}
