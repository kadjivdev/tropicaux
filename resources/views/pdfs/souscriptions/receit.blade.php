<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{public_path('fichiers/images/logo.png')}}" type="image/x-icon">

    <title>Reçu</title>
    <style>
        * {
            font-family: "Poppins";
        }

        #header {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
        }

        #logo {
            width: 100px;
            height: 100px;
        }

        #block {
            width: 100%;
            /* text-align: center; */
            margin: 0 auto;
        }

        #block-content {
            width: 80%;
            margin: 0 auto;
            background-color: #dccee5;
            border-radius: 10px;
            border: solid 2px #f6f6f6 !important;
            padding: 10px;
        }

        .school-contact,
        .school-slogan {
            font-weight: bold;
        }

        #souscriptionInFos {
            display: flex !important;
            justify-content: space-between !important;
        }

        .souscription_number {
            background-color: #000 !important;
            color: #fff !important;
            padding: 10px !important;
            border-radius: 10px !important;
            border: 3px solid #fff;
        }

        #resteBlock {
            background-color: #f6f6f6;
            border: #000 solid 2px;
            border-radius: 0px 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1px 5px;
        }

        .badge {
            background-color: #fff;
            padding: 2px 5px !important;
            border: solid 2px #f6f6f6;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>

<body class="p-0 m-0">
    <div class="container-fluid mx-0 px-0">
        <div id="block">
            <div id="block-content">
                <!-- HEADER -->
                <table id="header">
                    <tr>
                        <!-- Logo gauche -->
                        <td style="width: 25%; text-align: left;">
                            <img src="{{ public_path('fichiers/images/logo.png') }}"
                                id="logo"
                                alt="Logo de l'école"
                                style="max-width: 100px; height: auto;">
                        </td>

                        <!-- Texte centre -->
                        <td style="width: 50%; text-align: center;">
                            <h1 class="school-name" style="margin: 0; font-size: 18px; text-transform:uppercase">{{$inscription->school?->raison_sociale}}</h1>
                            <h3 style="margin: 2px 0;"></h3>
                            <p class="school-description" style="margin: 0;">{{$inscription->school?->description}}</p>
                            <p class="school-contact" style="margin: 0;">Tel: {{$inscription->school?->phone}}</p>
                            <p class="school-slogan" style="margin: 0;">{{$inscription->school?->slogan}}</p>
                        </td>

                        <!-- Logo reçu -->
                        <td style="width: 25%; text-align: right;">
                            <img src="{{ public_path('fichiers/images/recu-removebg.png') }}"
                                id="recuImg"
                                alt="Reçu"
                                style="max-width: 100px; height: auto;">
                        </td>
                    </tr>
                </table>

                <!-- Apprenant infos -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <!-- Colonne gauche -->
                        <td style="width: 50%; text-align: left; vertical-align: top;">
                            <p class="apprenant-name"><strong class="badge"> Nom & Prénom</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$inscription->apprenant?->firstname}} {{$inscription->apprenant?->lastname}}</strong></p>
                            <p class="apprenant-class"><strong class="badge"> Classe</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$inscription->apprenant?->classe?->libelle}}</strong></p>
                        </td>

                        <!-- Colonne droite -->
                        <td style="width: 30%; text-align: right; vertical-align: top;">
                            <p class="created_at"><strong class="badge">Délivré le</strong> : <strong style="margin-left:10px; border-bottom:1px dashed #000;">{{ \Carbon\Carbon::parse(now())->isoFormat('D MMMM YYYY') }}</strong></p>
                        </td>
                    </tr>

                </table>

                <br>
                <hr class="" style="width: 100%;color:#f6f6f6">
                <br>

                <!-- Info souscription -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <!-- Colonne gauche -->
                        <td style="width: 50%; text-align: left; vertical-align: top;">
                            <p class="souscription-frais"><strong class="badge">Frais de souscription</strong> : <strong style="margin-left:10px; border-bottom:1px dashed #000;">{{$inscription->frais_inscription}} {{ env('CURRENCY') }}</strong></p>
                            <p class="phone-parent"><strong class="badge">Contact des parents</strong> : <strong style="margin-left:10px; border-bottom:1px dashed #000;">{{$inscription->apprenant?->parent?->detail?->phone}}</strong></p>
                        </td>

                        <!-- Colonne droite -->
                        <td style="width: 30%; text-align: right; vertical-align: top;">
                            <div id="resteBlock">
                                <h3 class="souscription">N° souscription : <strong class="souscription_number">{{$inscription->numero}}</strong></h3>
                                <h3 class="souscription">Reste à payer : <strong class="souscription_number">{{$reste}} {{ env('CURRENCY') }}</strong></h3>
                            </div>
                            <p style="text-align: center;" class="">Service comptabilité</p>
                        </td>
                    </tr>
                </table>

            </div>
        </div>

    </div>
</body>

</html>