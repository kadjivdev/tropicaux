import React, { useState } from "react"
import {
    CSidebar,
    CSidebarNav,
    CNavGroup,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilApplications, cibMyspace, cibAlipay, cibTrainerroad, cibCashapp, cibCcAmazonPay, cibBaidu, cibAsana, cibDraugiemLv, cibFSecure, cibSamsungPay, cibProductHunt, cibMinutemailer, cibMeetup, cilList } from '@coreui/icons'
import { Link, usePage } from '@inertiajs/react'
import ApplicationLogo from './ApplicationLogo'

export default function SidebarMenu(props) {
    // const [visible, setVisible] = useState(false)
    // console.log(props)

    const user = usePage().props.auth.user;
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <>
            {
                props.showMenu &&
                <div className="">
                    <CSidebar
                        visible={props.visible}
                        onVisibleChange={(val) => props.setVisible(val)}
                        unfoldable
                        overlaid={false}   // ⬅️ enlève l’overlay sombre
                    >

                        <div className="m-2">
                            <Link href={route("campagne.index")}>
                                <ApplicationLogo className="block text-gray-800 dark:text-gray-200" />
                            </Link>
                        </div>

                        <CSidebarNav>

                            {/* Dashboard */}
                            <CNavTitle>Dashboard</CNavTitle>
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilApplications} /> Tableau de board
                                    </>
                                }
                            >
                                <Link href={route('dashboard')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Dashboard
                                </Link>
                            </CNavGroup>

                            <CNavTitle>PRE-CAMPAGNE</CNavTitle>

                            {/* Fournisseurs */}
                            {checkPermission('fournisseur.view') || checkPermission('fournisseur.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibMyspace} /> Les Fournisseurs
                                        </>
                                    }
                                >
                                    {checkPermission('fournisseur.view') ?
                                        (<Link href={route('fournisseur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des Fournisseurs
                                        </Link>) : null}

                                    {checkPermission('fournisseur.create') ? (<Link href={route('fournisseur.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un fournisseur
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Gestionnaires des fonds */}
                            {checkPermission('gestionnaire.view') || checkPermission('gestionnaire.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibAlipay} />Gestionnaires de fonds
                                        </>
                                    }
                                >
                                    {checkPermission('gestionnaire.view') ?
                                        (<Link href={route('gestionnaire.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des gestionnaires de fonds
                                        </Link>) : null}

                                    {checkPermission('gestionnaire.create') ? (<Link href={route('gestionnaire.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un gestionnaire
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Prefinancements */}
                            {checkPermission('prefinancement.view') || checkPermission('prefinancement.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibAlipay} /> Les Pré-Financements
                                        </>
                                    }
                                >
                                    {checkPermission('prefinancement.view') ?
                                        (<Link href={route('prefinancement.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des pré-financements
                                        </Link>) : null}

                                    {checkPermission('prefinancement.create') ? (<Link href={route('prefinancement.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un pré-financement
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Financement */}
                            {checkPermission('financement.view') || checkPermission('financement.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibAlipay} /> Les Financements
                                        </>
                                    }
                                >
                                    {checkPermission('financement.view') ?
                                        (<Link href={route('financement.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des financements
                                        </Link>) : null}

                                    {checkPermission('financement.create') ? (<Link href={route('financement.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un financement
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Retour de Financement */}
                            {checkPermission('backfinancement.view') || checkPermission('backfinancement.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibAlipay} /> Retour financements
                                        </>
                                    }
                                >
                                    {checkPermission('backfinancement.view') ?
                                        (<Link href={route('backfinancement.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des retours
                                        </Link>) : null}

                                    {checkPermission('backfinancement.create') ? (<Link href={route('backfinancement.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un retour
                                    </Link>) : null}
                                </CNavGroup> : null
                            }


                            <CNavTitle>CAMPAGNE OFFICIELLE</CNavTitle>
                            {/* Chargements */}
                            {checkPermission('chargement.view') || checkPermission('chargement.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibTrainerroad} /> Les Chargements
                                        </>
                                    }
                                >
                                    {checkPermission('chargement.view') ?
                                        (<Link href={route('chargement.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des Chargements
                                        </Link>) : null}

                                    {checkPermission('chargement.create') ? (<Link href={route('chargement.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un Chargement
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Fonds superviseur */}
                            {checkPermission('fond.superviseur.view') || checkPermission('fond.superviseur.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibCcAmazonPay} /> Fonds superviseurs
                                        </>
                                    }
                                >
                                    {checkPermission('fond.superviseur.view') ?
                                        (<Link href={route('fond-superviseur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des fonds
                                        </Link>) : null}

                                    {checkPermission('fond.superviseur.create') ? (<Link href={route('fond-superviseur.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un fonds
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Dépenses superviseurs */}
                            {checkPermission('depense.superviseur.view') || checkPermission('depense.superviseur.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibCashapp} /> Dépenses superviseur
                                        </>
                                    }
                                >
                                    {checkPermission('depense.superviseur.view') ?
                                        (<Link href={route('depense-superviseur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des dépenses
                                        </Link>) : null}

                                    {checkPermission('depense.superviseur.create') ? (<Link href={route('depense-superviseur.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une dépense
                                    </Link>) : null}
                                </CNavGroup> : null
                            }


                            <CNavTitle>GESTION DES VENTES</CNavTitle>

                            {/* Partenaires */}
                            {checkPermission('partenaire.view') || checkPermission('partenaire.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibBaidu} /> Les Partenaires
                                        </>
                                    }
                                >
                                    {checkPermission('partenaire.view') ?
                                        (<Link href={route('partenaire.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des Partenaires
                                        </Link>) : null}

                                    {checkPermission('partenaire.create') ? (<Link href={route('partenaire.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un partenaire
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Ventes */}
                            {checkPermission('vente.view') || checkPermission('vente.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibAsana} /> Les Ventes
                                        </>
                                    }
                                >
                                    {checkPermission('vente.view') ?
                                        (<Link href={route('vente.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des Ventes
                                        </Link>) : null}

                                    {checkPermission('vente.create') ? (<Link href={route('vente.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une vente
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            {/* Dépenses ventes */}
                            {checkPermission('vente.view') || checkPermission('vente.create') ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success text-bold" icon={cibCashapp} /> Dépense ventes
                                        </>
                                    }
                                >
                                    {checkPermission('vente.view') ?
                                        (<Link href={route('depense-vente.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des dépenses
                                        </Link>) : null}

                                    {checkPermission('vente.create') ? (<Link href={route('depense-vente.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une dépense 
                                    </Link>) : null}
                                </CNavGroup> : null
                            }

                            <CNavTitle>Paramètrage</CNavTitle>

                            {/* utilisateurs */}
                            {checkPermission('utilisateur.view') || checkPermission('utilisateur.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibDraugiemLv} /> Les utilisateurs
                                        </>
                                    }
                                >
                                    {checkPermission('utilisateur.view') ?
                                        (<Link component={Link} href={route('user.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des utilisateurs
                                        </Link>) : null}

                                    {checkPermission('utilisateur.create') ?
                                        (<Link href={route('user.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un utilisateur
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Roles */}
                            {checkPermission('role.view') || checkPermission('role.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibFSecure} /> Les rôles
                                        </>
                                    }
                                >
                                    {checkPermission('role.view') ?
                                        (<Link component={Link} href={route('role.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des rôles
                                        </Link>) : null}

                                    {checkPermission('role.create') ?
                                        (<Link href={route('role.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un rôle
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Mode paiement */}
                            {checkPermission('paiement.mode.view') || checkPermission('paiement.mode.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibSamsungPay} /> Modes de paiement
                                        </>
                                    }
                                >
                                    {checkPermission('paiement.mode.view') ?
                                        (<Link component={Link} href={route('mode-paiement.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des modes
                                        </Link>) : null}

                                    {checkPermission('paiement.mode.create') ?
                                        (<Link href={route('mode-paiement.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un mode
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Produit */}
                            {checkPermission('produit.view') || checkPermission('produit.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibProductHunt} /> Les Produits
                                        </>
                                    }
                                >
                                    {checkPermission('produit.view') ?
                                        (<Link component={Link} href={route('produit.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des produits
                                        </Link>) : null}

                                    {checkPermission('produit.create') ?
                                        (<Link href={route('produit.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un produit
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Camions */}
                            {checkPermission('camion.view') || checkPermission('camion.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibTrainerroad} /> Les Camions
                                        </>
                                    }
                                >
                                    {checkPermission('camion.view') ?
                                        (<Link component={Link} href={route('camion.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des camions
                                        </Link>) : null}

                                    {checkPermission('camion.create') ?
                                        (<Link href={route('camion.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un camion
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Chauffeurs */}
                            {checkPermission('chauffeur.view') || checkPermission('chauffeur.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibMyspace} /> Les Chauffeurs
                                        </>
                                    }
                                >
                                    {checkPermission('chauffeur.view') ?
                                        (<Link component={Link} href={route('chauffeur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des chauffeurs
                                        </Link>) : null}

                                    {checkPermission('chauffeur.create') ?
                                        (<Link href={route('chauffeur.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un chauffeur
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Superviseurs */}
                            {checkPermission('superviseur.view') || checkPermission('superviseur.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibDraugiemLv} /> Les Superviseurs
                                        </>
                                    }
                                >
                                    {checkPermission('superviseur.view') ?
                                        (<Link component={Link} href={route('superviseur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des superviseurs
                                        </Link>) : null}

                                    {checkPermission('superviseur.create') ?
                                        (<Link href={route('superviseur.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un superviseur
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Magasin */}
                            {checkPermission('magasin.view') || checkPermission('magasin.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibMeetup} /> Les Magasins
                                        </>
                                    }
                                >
                                    {checkPermission('magasin.view') ?
                                        (<Link component={Link} href={route('magasin.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des magasins
                                        </Link>) : null}

                                    {checkPermission('magasin.create') ?
                                        (<Link href={route('magasin.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un magasin
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }

                            {/* Convoyeur */}
                            {checkPermission('convoyeur.view') || checkPermission('convoyeur.create') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibMinutemailer} /> Les Convoyeurs
                                        </>
                                    }
                                >
                                    {checkPermission('convoyeur.view') ?
                                        (<Link component={Link} href={route('convoyeur.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des convoyeurs
                                        </Link>) : null}

                                    {checkPermission('convoyeur.create') ?
                                        (<Link href={route('convoyeur.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un convoyeur
                                        </Link>) : null
                                    }
                                </CNavGroup>) : null
                            }
                        </CSidebarNav>
                    </CSidebar>
                </div>
            }
        </>
    )
}