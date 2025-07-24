<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "commande")]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer", name: "id_commande")]
    private $idCommande;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "commandes")]
    #[ORM\JoinColumn(name: "id_client", referencedColumnName: "id")]
    private $client;

    #[ORM\ManyToOne(targetEntity: AdresseClient::class, inversedBy: "commandes")]
    #[ORM\JoinColumn(name: "id_adresse_livraison", referencedColumnName: "id_adresse")]
    private $adresseLivraison;

    #[ORM\Column(type: "datetime", name: "date_commande")]
    private $dateCommande;

    #[ORM\OneToMany(targetEntity: CommandeDetail::class, mappedBy: "commande")]
    private $details;

    public function __construct()
    {
        $this->details = new ArrayCollection();
    }

    public function getIdCommande(): ?int
    {
        return $this->idCommande;
    }

    public function getClient(): ?User
    {
        return $this->client;
    }

    public function setClient(?User $client): self
    {
        $this->client = $client;

        return $this;
    }

    public function getAdresseLivraison(): ?AdresseClient
    {
        return $this->adresseLivraison;
    }

    public function setAdresseLivraison(?AdresseClient $adresseLivraison): self
    {
        $this->adresseLivraison = $adresseLivraison;

        return $this;
    }

    public function getDateCommande(): ?\DateTimeInterface
    {
        return $this->dateCommande;
    }

    public function setDateCommande(\DateTimeInterface $dateCommande): self
    {
        $this->dateCommande = $dateCommande;

        return $this;
    }

    /**
     * @return Collection|CommandeDetail[]
     */
    public function getDetails(): Collection
    {
        return $this->details;
    }
}
