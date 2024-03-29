# Написать токен стандарта ERC-20
* Реализовать весь основной функционал контракта. Не наследовать от openzeppelin и прочих библиотек и не копировать код (!)
* Добавить функции mint и burn
* Написать полноценные тесты к контракту
* Написать скрипт деплоя
* Задеплоить в тестовую сеть
* Написать таски на transfer, transferFrom, approve
* Верифицировать контракт

###Требования
* Все ERC20 токены в сети должны удовлетворять стандарту описанному в eip.
* Содержать полный набор функций из eip.
* Реализация логики и ответственность за правильность лежит на вас, впрочем в сети полно примеров ERC20 токенов, где можно посмотреть как обычно выглядит реализация подобных токенов.

# Cтейкинг

Написать смарт-контракт стейкинга, создать пул ликвидности на uniswap в тестовой сети. Контракт стейкинга принимает ЛП токены,
после определенного времени (например 10 минут) пользователю начисляются награды в виде ревард токенов написанных на первой неделе.
Количество токенов зависит от суммы застейканных ЛП токенов (например 20 процентов).
Вывести застейканные ЛП токены также можно после определенного времени (например 20 минут).

- Создать пул ликвидности
- Реализовать функционал стейкинга в смарт контракте
- Написать полноценные тесты к контракту
- Написать скрипт деплоя
- Задеплоить в тестовую сеть
- Написать таски на stake, unstake, claim
- Верифицировать контракт

#### Требования
- Функция stake(uint256 amount) - списывает с пользователя на контракт стейкинга ЛП токены в количестве amount, обновляет в контракте баланс пользователя
- Функция claim() - списывает с контракта стейкинга ревард токены доступные в качестве наград
- Функция unstake() - списывает с контракта стейкинга ЛП токены доступные для вывода
- Функции админа для изменения параметров стейкинга (время заморозки, процент)

#### Ссылки
* https://app.uniswap.org/#/pool/v2?chain=rinkeby
* https://docs.uniswap.org/protocol/V2/introduction
* https://drive.google.com/file/d/1EK0sNh_yAdE7FtML-jlwkVtcs1TsMymd/view?usp=sharing
