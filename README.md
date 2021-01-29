## Desafio técnico backend Cubos 

### Obetivo

Criar uma API REST para facilitar o gerenciamento de horários de uma clínica.


### Features

    - Cadastrar regras de horários para atendimento
    - Apagar regra de horário para atendimento
    - Listar regras de horários para atendimento
    - Listar horários disponíveis dentro de um intervalo

[Desafio Backend Cubos](https://git.cubos.io/cubos/desafios-tecnicos/desafio-tecnico-backend)

### Get Started

#### Instalar todas as dependências

    npm install

#### Executar o sistema 

    npm start

#### Requisições do postman

##### Colection V1

[https://gitlab.com/lucashca/cubos-desafio-tecnico-backend/-/blob/master/postman/Cubos%20-%20Desafio%20Backend.postman_collection.json](https://gitlab.com/lucashca/cubos-desafio-tecnico-backend/-/blob/master/postman/Cubos%20-%20Desafio%20Backend.postman_collection.json)

##### Colection v2

[https://gitlab.com/lucashca/cubos-desafio-tecnico-backend/-/blob/master/postman/Cubos%20-%20Desafio%20Backend.postman_collection_v2.json](https://gitlab.com/lucashca/cubos-desafio-tecnico-backend/-/blob/master/postman/Cubos%20-%20Desafio%20Backend.postman_collection_v2.json)


##### Link workspace

[https://www.getpostman.com/collections/17a8d896a6b2216a466f](https://www.getpostman.com/collections/17a8d896a6b2216a466f)


#### Executar as rotinas de teste unitário

    npm test

Para um melhor resultado nos testes recomendo que delete o arquivo que armazena todas as informações ,`DATABASE.json`.

##### Resultados dos testes unitários

![imagem_test](https://gitlab.com/lucashca/cubos-desafio-tecnico-backend/-/raw/adefa08dde8055f5bec6dda44d6675fa2c573a23/resultados%20dos%20testes%20%C3%BAnitarios.png)

### Endpoints

Com a problemática, foi possivél identificar a necessidade dos seguintes endpoints.

#### /saveRules
* ***Method:*** `POST`
* ***Description:*** Salva uma ou mais regras que forem passadas como atributo.
* ***Attributes:*** Um array de regras de horários disponiveis ou apenas uma regra, a seguir serão exemplificadas como são estes atributos.


##### Array com os tipos de regras possíveis

Exemplo de dados que são passados para salvar multiplas regras.

```json
[{
	"type":"DAILY",
	"intervals": [{"start":"13:30","end":"14:25"}]
},
{
	"type":"SPECIFIC_DATE",
	"day":"31-02-2021",
	"intervals": [{"start":"05:50","end":"06:25"}]
},
{
	"type":"WEEKLY",
	"daysInWeek":[1,2,3],
	"intervals": [{"start":"18:30","end":"19:25"}]
}]

```

##### Uma única regra

Exemplo de dados que são passadas para salvar uma única regra.

```json
{
	"type":"WEEKLY",
	"daysInWeek":[1,5],
	"intervals": [{"start":"19:59","end":"20:20"}]
}
```

* ***Return Value:*** 
* Quando sucesso `status` será 201(created) e `response` será o objeto que foi salvo pelo sistema com a requisição passada. 

##### Exemplo de retorno com sucesso

Exemplo de retorno de sucesso de uma requisisão que utiliza os dados com multiplas regras informado anteriormente.
```json
[{
        "id": "1611875821764-821",
        "type": "DAILY",
        "intervals": [{"start": "13:30","end": "14:25"}],
        "day": null,
        "daysInWeek": null
},{
        "id": "1611875821764-621",
        "type": "SPECIFIC_DATE",
        "intervals": [{"start": "05:50","end": "06:25"}],
        "day": "31-02-2021",
        "daysInWeek": null
},{
        "id": "1611875821764-871",
        "type": "WEEKLY",
        "intervals": [{"start": "18:30","end": "19:25"}],
        "day": null,
        "daysInWeek": [1,2,3]
}]

```

##### Exemplo de retorno com falha

* Quando falha `status` será 401 e `error` será um objeto de erro contendo mais detalhes sobre o evento.

```json
{
    "code": 100,
    "message": "Intervalo em conflito com o banco de dados. {start:'13:30',end:'14:25'} , {start:'13:30',end:'14:25'}.",
    "objectInvalid": {"intervals": [{"start": "13:30", "end": "14:25"},{"start": "13:30", "end": "14:25"}]}
}
```


#### /listScheduleRule
* ***Method:*** `GET`
* ***Description:*** Retorna um array que contém todas regras de intervalos salvas no sistema.
* ***Attributes:*** Nenhum
* ***Return Value:*** `response` será um array com todas as regras de horários salvas no sistema.

##### Exemplo de retorno com sucesso

```json
[{
        "id": "1611875821764-821",
        "type": "DAILY",
        "intervals": [{"start": "13:30","end": "14:25"}],
        "day": null,
        "daysInWeek": null
},{
        "id": "1611875821764-621",
        "type": "SPECIFIC_DATE",
        "intervals": [{"start": "05:50","end": "06:25"}],
        "day": "31-02-2021",
        "daysInWeek": null
}]
```


#### /deleteScheduleRuleById/:id
* ***Method:*** `DELETE`
* ***Description:*** Deleta uma regra de horário que apresenta o identificador que é passado como atributo 
* ***Attributes:*** `id` este parâmetro é passado via url e representa um identificador de uma regra salva no sistema.
* ***Return Value:*** 
*   Quando sucesso `status` será 200 e `response`  será `true`
*   Quando falha `status` será 401 e `error` será um objeto de erro contendo mais detalhes sobre o evento.

##### Exemplo de retorno com falha

```json
{
    "code": 103,
    "message": "O identificador'3124654654' não foi encontrado. ",
    "objectInvalid": null
}
```




#### /listScheduleRuleInRange/:startDate/:endDate
* ***Method:*** `GET`
* ***Description:*** Retorna um array com os dias e intervalos de horários para cada dia.
* ***Attributes:*** `startDate` que representa a data inicial, `endDate` representa a data final, ambas devem estar no seguinte formato `DD-MM-YYYY` ex `14-10-2021`.
* ***Return Value:***
* Quando sucesso `status` será 200 e `response` um array com os dias e intervalos para cada dia.

##### Exemplo de retorno com sucesso para `/listScheduleRuleInRange/25-10-2021/28-10-2021`

```json
[
    {
        "day": "25-10-2021",
        "intervals": [{"start": "13:30","end": "14:25"},{"start": "18:30","end": "19:25"}]
    },
    {
        "day": "26-10-2021",
        "intervals": [{"start": "13:30","end": "14:25"},{"start": "18:30","end": "19:25"}]
    },
    {
        "day": "27-10-2021",
        "intervals": [{"start": "13:30","end": "14:25"},{"start": "18:30","end": "19:25"}]
    },
    {
        "day": "28-10-2021",
        "intervals": [{"start": "13:30","end": "14:25"}]
    }
]
```

##### Exemplo de retorno com falha para `/listScheduleRuleInRange/29-10-2021/28-10-2021`

* Quando falha `status` será 401 e `error` será um objeto de erro contendo mais detalhes sobre o evento.

```json

    {
    "code": 105,
    "message": "O interválo informado não é válido.",
    "objectInvalid": null
    }

```



### Regras de agendamento

O problema apresentado informou os seguintes critérios para as regras de agendamento: 

    - Um dia especifico, por exemplo: estará disponível para atender dia 25/06/2018 nos intervalos de 9:30 até 10:20 e de 10:30 até as 11:00
    - Diariamente, por exemplo: estará disponível para atender todos os dias das 9:30 até as 10:10
    - Semanalmente, por exemplo: estará disponível para atender todas segundas e quartas das 14:00 até as 14:30
[Desafio Backend Cubos](https://git.cubos.io/cubos/desafios-tecnicos/desafio-tecnico-backend)


Com isso, a abordagem utilizada para atender estes critérios foi a criação de uma classe que comportasse todos os atributos necessários para as três regras possíveis e utilizasse um identificador para diferênciá-las das demais e um tipo especifico para cada regra existente, então as classes `Schedule` e `Interval`foram criadas, também o enum `ScheduleRuleType`, a seguir são apresentadas estes itens. Alguns atributos específicos devem ser passados em cada regra de horários. 


##### Regra de horários diário.

Para salvar uma regra de horários diários, o atributo `type` deverá ser definido como `DAILY` e deverá ser adicionado um intervalo, os outros atributos serão desconsiderados, o código abaixo exemplifica como deve ser.

```json 
{
	"type":"DAILY",
	"intervals": [{"start":"8:30","end":"9:25"}]
}
```


##### Regra de horários semanais.

Para salvar uma regra de horários semanais, o atributo `type` deverá ser definido como `WEEKLY`, o atributo`daysInWeek` deve ser preenchido corretamente,verifique a [tabela de específicação da classe Schedule](#tab-schedule) e deverá ser adicionado um intervalo, os outros atributos serão desconsiderados, o código abaixo exemplifica como deve ser.

```json
{
	"type":"WEEKLY",
	"daysInWeek":[1,5],
	"intervals": [{"start":"19:59","end":"20:20"}]
}
```



##### Regra de horários para um dia específico.

Para salvar uma regra de horários em um dia específico, o atributo `type` deverá ser definido como `SPECIFIC_DATE`, o atributo `day` deve ser preenchido corretamente,verifique a [tabela de específicação da classe Schedule](#tab-schedule) e deverá ser adicionado um intervalo, os outros atributos serão desconsiderados, o código abaixo exemplifica como deve ser.

```json
{
	"type":"SPECIFIC_DATE",
	"day":"27-10-2021",
	"intervals": [{"start": "18:58","end": "19:25"}]
}
```



##### Classe Schedule
```js
export default class Schedule {

    public id: string;
    public type: ScheduleRuleType;
    public day: String;
    public intervals: Array<Interval>;
    public daysInWeek: Array<Number>;

    constructor(type: ScheduleRuleType, intervals: Array<Interval>, day: String, daysInWeek: Array<Number>) {
      ...
    }
}
```

<a name="tab-schedule"><a>
##### Legenda dos atributos da classe `Schedule`

|Attribute| Type | Details | Exemple |
|---------|------|---------|---------|
|id|String|Identificador único para a regra de horários.|'12345657-414'|
|type|ScheduleRuleType - Enum|Um enum que defie os tipos possíves de regras que podem estar no sistema.|`DAILY` - Representa a regra de horários para todos os dias da semana.`SPECIFIC_DATE` - Representa a regra de horários para uma data específica.`WEEKLY` - Representa a regra de horários para dias específicos na semana. |
|interval|Interval[]|Representa um array da classe `Interval` que informa os intervalos de horários este objeto possui os seguintes atributos:`start` - Recebe uma string que representa um horário no formato (24hs) `hh:mm`, este valor deve ser inferior ao atributo `end`.`end` -  Recebe uma string que representa um horário no formato (24hs) `hh:mm`, este valor deve ser superior ao atributo `start`.| [{"start": "05:50","end": "06:25"}]|
|day|String|Representa um dia específico, é utilizado quando `type` é `SPECIFIC_DATE`, o formato deve ser `DD-MM-YYYY`|"23-10-2021"|
|daysInWeek|Number[]| Representa os dias da semana em que a regra será válida. Este atributo deve ser utilizado quando `type` for `WEEKLY`, o valor de entrada deve ser informado com um array númerico representado os dias da semana.|[0,2,5], sendo que o 0 representa o domingo e assim consecutivamente, logo o array representa 'domingo','terça','sexta'.|




##### Classe Interval

```js
export default class Interval {

    public start: String;
    public end: String;

    constructor(start: String, end: String) {
      ...
    }
} 

```
##### Legenda dos atributos da classe `Interval`


| Attribute | Type   | Details                                                                                              | Exemple |
| --------- | ------ | ---------------------------------------------------------------------------------------------------- | ------- |
| start     | String | Representa um horário no formato (24hs) `hh:mm`, este valor deve ser inferior ao atributo `end`   | "06:25" |
| end       | String | representa um horário no formato (24hs) `hh:mm`, este valor deve ser superior ao atributo `start` | "08:25" |


##### Enum ScheduleRuleType

```js

export enum ScheduleRuleType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    SPECIFIC_DATE = "SPECIFIC_DATE"
}

```



### Validação dos dados

Para realizar o processo de validação das informações, a  classe `ApplicationError` foi criada, esta auxilia no processo de especificação de um erro a ser descrito no sistema, utiliza um código para cada tipo de erro disparado, assim será fácil de identificar o motivo da falha.


##### Classe ApplicationError

```js 
export class ApplicationError {

    public code: ErrorCodEnum;
    public message: String;
    public objectInvalid: any;

    constructor(code, message, objectInvalid = null) {
       ...
    }
}

```

##### Legenda dos atributos da classe `ApplicationError`



|Attribute| Type | Details | Exemple |
|---------|------|---------|---------|
|code|ErrorCodEnum|Um valor númerico que informa o tipo do erro.| Informações na tabela a seguir.|
|message|String|Mensagem que detalha melhor o erro que ocorreu.|"Intervalo em conflito com o banco de dados. {start:'8:30',end:'9:25'} , {start:'8:30',end:'9:25'}."|
|objectInvalid|any|Objeto fonte da origem do problema.|{"intervals": [{"start": "8:30","end": "9:25"},{"start": "8:30","end": "9:25"}]}|




##### Legenda códigos de erros

| Code | Details                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------- |
| 100  | Quando for identificado um intervalo inválido                                                                   |
| 101  | Quando for identificado uma string de dia inválido                                                              |
| 102  | Quando for identificado que o atributo `daysOfWeek` da classe `Schedule` é inválido                             |
| 103  | Quando não for encontrado um objeto com um id específico.                                                      |
| 104  | Quando houver um erro durante o processo de salvamento, relacionado a falhas de após os dados estarem válidados. |
| 105  | Quando for identificado um valor inválido para o atributo `type` da classe `Schedule`.                          |


