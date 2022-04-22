<?php

namespace App\Models;

class ContractInfo
{
    protected string $start;
    protected string $dest;
    protected float $distance;
    protected int $heading;
    protected array $cargo;
    protected float $value;
    protected bool $custom = false;
    protected ?int $userId = null;

    public function setStart(string $data)
    {
        $this->start = $data;
    }

    public function setDest(string $data)
    {
        $this->dest = $data;
    }

    public function setDistance(float $data)
    {
        $this->distance = $data;
    }

    public function setHeading(int $data)
    {
        $this->heading = $data;
    }

    public function setCargo(array $data)
    {
        $this->cargo = $data;
    }

    public function setValue(float $data)
    {
        $this->value = $data;
    }

    public function setCustom(bool $data)
    {
        $this->custom = $data;
    }

    public function setUserId(?int $data)
    {
        $this->userId = $data;
    }

    public function getStart(): string
    {
        return $this->start;
    }

    public function getDest(): string
    {
        return $this->dest;
    }

    public function getDistance(): float
    {
        return $this->distance;
    }

    public function getHeading(): int
    {
        return $this->heading;
    }

    public function getCargo(): array
    {
        return $this->cargo;
    }

    public function getValue(): float
    {
        return $this->value;
    }

    public function getCustom(): bool
    {
        return $this->custom;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }
}
